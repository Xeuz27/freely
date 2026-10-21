import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { WorkspaceHeader } from '@/modules/core/components/workspace-Header.tsx'
import { type Lead } from '@/types/crm-types'
import {
	type Project,
	type ProjectPriority,
	projectPriorityConfig,
	type ProjectStatus,
	projectStatusConfig
} from '@/types/project-types'
import { ArrowUpDown, Filter, FolderKanban, Plus } from 'lucide-react'
import { useState } from 'react'
import { ProjectRow } from './project-row.tsx'
import { ProjectSheet } from './project-sheet.tsx'
import { sampleProjects } from 'src/data/sampleProjects.ts'
import { sampleLeads } from 'src/data/sampleLeads.ts'

type SortField = 'name' | 'status' | 'priority' | 'deliveryDate' | 'startDate'
type SortOrder = 'asc' | 'desc'

export function ProjectBoard() {
	const [projects, setProjects] = useState<Project[]>(sampleProjects)
	const [leads] = useState<Lead[]>(sampleLeads)
	const [searchQuery, setSearchQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
	const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | 'all'>('all')
	const [sheetOpen, setSheetOpen] = useState(false)
	const [editingProject, setEditingProject] = useState<Project | null>(null)
	const [sortField, setSortField] = useState<SortField>('deliveryDate')
	const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

	const handleSaveProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
		if (projectData.id) {
			setProjects((prev) =>
				prev.map((project) =>
					project.id === projectData.id ? { ...project, ...projectData, updatedAt: new Date() } : project
				)
			)
		} else {
			const newProject: Project = {
				...projectData,
				id: crypto.randomUUID(),
				createdAt: new Date(),
				updatedAt: new Date()
			}
			setProjects((prev) => [newProject, ...prev])
		}
		setEditingProject(null)
	}

	const handleDeleteProject = (id: string) => {
		setProjects((prev) => prev.filter((project) => project.id !== id))
	}

	const handleEditProject = (project: Project) => {
		setEditingProject(project)
		setSheetOpen(true)
	}

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
		} else {
			setSortField(field)
			setSortOrder('asc')
		}
	}

	const filteredAndSortedProjects = projects
		.filter((project) => {
			const matchesSearch =
				project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				project.ownerId?.toLowerCase().includes(searchQuery.toLowerCase())
			const matchesStatus = statusFilter === 'all' || project.status === statusFilter
			const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter
			return matchesSearch && matchesStatus && matchesPriority
		})
		.sort((a, b) => {
			let comparison = 0
			switch (sortField) {
				case 'name':
					comparison = a.name.localeCompare(b.name)
					break
				case 'status':
					comparison = a.status.localeCompare(b.status)
					break
				case 'priority':
					const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
					comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
					break
				case 'deliveryDate':
					comparison = a.deliveryDate!.getTime() - b.deliveryDate!.getTime()
					break
				case 'startDate':
					comparison = a.startDate!.getTime() - b.startDate!.getTime()
					break
			}
			return sortOrder === 'asc' ? comparison : -comparison
		})

	const statusCounts = projects.reduce(
		(acc, project) => {
			acc[project.status] = (acc[project.status] || 0) + 1
			return acc
		},
		{} as Record<ProjectStatus, number>
	)

	const activeProjects = projects.filter((p) => p.status !== 'completed' && p.status !== 'cancelled').length

	return (
		<div className="bg-background flex h-screen flex-1 flex-col px-4">
			<WorkspaceHeader>
				<WorkspaceHeader.Content
					title="Projects"
					description={`${activeProjects} active project${activeProjects > 1 ? 's' : ''}`}
					Icon={FolderKanban}
				/>
				<WorkspaceHeader.Actions>
					<WorkspaceHeader.Search
						placeholder="Search Projects..."
						value={searchQuery}
						onSearch={setSearchQuery}
					/>
					<WorkspaceHeader.Button
						text="Add Project"
						onClick={() => {
							setEditingProject(null)
							setSheetOpen(true)
						}}
					/>
				</WorkspaceHeader.Actions>
			</WorkspaceHeader>

			<div className="border-border border-b px-6 py-4">
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2">
						<Filter className="text-muted-foreground size-4" />
						<span className="text-muted-foreground text-sm">Filter:</span>
					</div>

					<Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ProjectStatus | 'all')}>
						<SelectTrigger className="w-37.5">
							<SelectValue placeholder="All statuses" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Statuses</SelectItem>
							{Object.entries(projectStatusConfig).map(([key, config]) => (
								<SelectItem key={key} value={key}>
									<div className="flex items-center gap-2">
										<Badge variant="outline" className={`${config.color} border text-xs`}>
											{config.label}
										</Badge>
										<span className="text-muted-foreground text-xs">
											({statusCounts[key as ProjectStatus] || 0})
										</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={priorityFilter}
						onValueChange={(v) => setPriorityFilter(v as ProjectPriority | 'all')}
					>
						<SelectTrigger className="w-35">
							<SelectValue placeholder="All priorities" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Priorities</SelectItem>
							{Object.entries(projectPriorityConfig).map(([key, config]) => (
								<SelectItem key={key} value={key}>
									<Badge variant="outline" className={`${config.color} border text-xs`}>
										{config.label}
									</Badge>
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<div className="text-muted-foreground ml-auto flex items-center gap-2 text-sm">
						<span>
							{filteredAndSortedProjects.length} project
							{filteredAndSortedProjects.length !== 1 ? 's' : ''}
						</span>
					</div>
				</div>
			</div>

			<div className="flex-1 overflow-auto p-6">
				<div className="border-border bg-card rounded-lg border">
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead>
									<button
										onClick={() => handleSort('name')}
										className="hover:text-foreground flex items-center gap-1"
									>
										Project Name
										<ArrowUpDown className="size-3" />
									</button>
								</TableHead>
								<TableHead>
									<button
										onClick={() => handleSort('status')}
										className="hover:text-foreground flex items-center gap-1"
									>
										Status
										<ArrowUpDown className="size-3" />
									</button>
								</TableHead>
								<TableHead>
									<button
										onClick={() => handleSort('priority')}
										className="hover:text-foreground flex items-center gap-1"
									>
										Priority
										<ArrowUpDown className="size-3" />
									</button>
								</TableHead>
								{/* <TableHead>Linked Lead</TableHead> */}
								<TableHead>Owner</TableHead>
								<TableHead>
									<button
										onClick={() => handleSort('startDate')}
										className="hover:text-foreground flex items-center gap-1"
									>
										Start Date
										<ArrowUpDown className="size-3" />
									</button>
								</TableHead>
								<TableHead>
									<button
										onClick={() => handleSort('deliveryDate')}
										className="hover:text-foreground flex items-center gap-1"
									>
										Delivery Date
										<ArrowUpDown className="size-3" />
									</button>
								</TableHead>
								<TableHead className="w-12.5"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredAndSortedProjects.length === 0 ? (
								<TableRow>
									<td colSpan={8} className="py-12 text-center">
										<div className="flex flex-col items-center gap-2">
											<FolderKanban className="text-muted-foreground/50 size-8" />
											<p className="text-muted-foreground">No projects found</p>
											<Button
												variant="outline"
												size="sm"
												onClick={() => {
													setEditingProject(null)
													setSheetOpen(true)
												}}
											>
												<Plus className="mr-1 size-4" />
												Create your first project
											</Button>
										</div>
									</td>
								</TableRow>
							) : (
								filteredAndSortedProjects.map((project) => (
									<ProjectRow
										key={project.id}
										project={project}
										lead={leads.find((l) => l.id === project.leadId)}
										onEdit={handleEditProject}
										onDelete={handleDeleteProject}
									/>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			<ProjectSheet
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				onSave={handleSaveProject}
				onDelete={handleDeleteProject}
				editProject={editingProject}
				leads={leads}
			/>
		</div>
	)
}
