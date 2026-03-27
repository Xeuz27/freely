'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { type Lead } from '@/types/crm-types'
import { type Project, type ProjectPriority, projectPriorityConfig, type ProjectStatus, projectStatusConfig } from '@/types/project-types'
import { ArrowUpDown, Filter, FolderKanban, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { ProjectRow } from './project-row.tsx'
import { ProjectSheet } from './project-sheet.tsx'

const initialLeads: Lead[] = [
	{
		id: '1',
		name: 'Sarah Chen',
		email: 'sarah@techcorp.com',
		phone: '+1 (555) 123-4567',
		company: 'TechCorp Inc.',
		status: 'qualified',
		note: 'Interested in enterprise plan',
		info: 'Met at SaaS conference, needs CRM integration',
		createdAt: new Date('2024-01-15'),
		updatedAt: new Date('2024-01-20')
	},
	{
		id: '2',
		name: 'Marcus Johnson',
		email: 'marcus@startupxyz.io',
		phone: '+1 (555) 987-6543',
		company: 'StartupXYZ',
		status: 'proposal',
		note: 'Sent proposal last week',
		info: 'Early-stage startup, budget conscious',
		createdAt: new Date('2024-01-10'),
		updatedAt: new Date('2024-01-22')
	},
	{
		id: '3',
		name: 'David Kim',
		email: 'david@globaltech.com',
		phone: '+1 (555) 456-7890',
		company: 'GlobalTech Solutions',
		status: 'negotiation',
		note: 'Discussing contract terms',
		info: 'Enterprise client, 500+ users',
		createdAt: new Date('2024-01-05'),
		updatedAt: new Date('2024-01-24')
	}
]

const initialProjects: Project[] = [
	{
		id: '1',
		name: 'Website Redesign',
		description: 'Complete overhaul of the corporate website with new branding',
		status: 'in_progress',
		priority: 'high',
		ownerId: 'John Smith',
		leadId: '1',
		startDate: new Date('2024-01-15'),
		deliveryDate: new Date('2024-03-15'),
		createdAt: new Date('2024-01-10'),
		updatedAt: new Date('2024-01-25')
	},
	{
		id: '2',
		name: 'Mobile App Development',
		description: 'Build native iOS and Android apps for the platform',
		status: 'planning',
		priority: 'urgent',
		ownerId: 'Jane Doe',
		leadId: '2',
		startDate: new Date('2024-02-01'),
		deliveryDate: new Date('2024-06-30'),
		createdAt: new Date('2024-01-20'),
		updatedAt: new Date('2024-01-20')
	},
	{
		id: '3',
		name: 'CRM Integration',
		description: 'Integrate with third-party CRM systems',
		status: 'review',
		priority: 'medium',
		ownerId: 'Mike Wilson',
		leadId: '3',
		startDate: new Date('2024-01-01'),
		deliveryDate: new Date('2024-02-28'),
		createdAt: new Date('2023-12-15'),
		updatedAt: new Date('2024-01-22')
	},
	{
		id: '4',
		name: 'Data Migration',
		description: 'Migrate legacy data to new infrastructure',
		status: 'completed',
		priority: 'low',
		ownerId: 'Sarah Johnson',
		startDate: new Date('2023-11-01'),
		deliveryDate: new Date('2024-01-15'),
		createdAt: new Date('2023-10-20'),
		updatedAt: new Date('2024-01-15')
	},
	{
		id: '5',
		name: 'Security Audit',
		description: 'Comprehensive security review and penetration testing',
		status: 'on_hold',
		priority: 'high',
		ownerId: 'Alex Brown',
		startDate: new Date('2024-02-15'),
		deliveryDate: new Date('2024-03-30'),
		createdAt: new Date('2024-01-18'),
		updatedAt: new Date('2024-01-23')
	}
]

type SortField = 'name' | 'status' | 'priority' | 'deliveryDate' | 'startDate'
type SortOrder = 'asc' | 'desc'

export function ProjectBoard() {
	const [projects, setProjects] = useState<Project[]>(initialProjects)
	const [leads] = useState<Lead[]>(initialLeads)
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
				prev.map((project) => (project.id === projectData.id ? { ...project, ...projectData, updatedAt: new Date() } : project))
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
					comparison = a.deliveryDate.getTime() - b.deliveryDate.getTime()
					break
				case 'startDate':
					comparison = a.startDate.getTime() - b.startDate.getTime()
					break
			}
			return sortOrder === 'asc' ? comparison : -comparison
		})

	const statusCounts = projects.reduce((acc, project) => {
		acc[project.status] = (acc[project.status] || 0) + 1
		return acc
	}, {} as Record<ProjectStatus, number>)

	const activeProjects = projects.filter((p) => p.status !== 'completed' && p.status !== 'cancelled').length

	return (
		<div className="flex flex-col h-screen bg-background">
			<header className="flex items-center justify-between px-6 py-4 border-b border-border">
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center size-9 rounded-lg bg-primary/10">
						<FolderKanban className="size-5 text-primary" />
					</div>
					<div>
						<h1 className="text-lg font-semibold text-foreground">Projects</h1>
						<p className="text-xs text-muted-foreground">
							{activeProjects} active project{activeProjects !== 1 ? 's' : ''}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
						<Input
							placeholder="Search projects..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9 w-64 bg-secondary/50"
						/>
					</div>
					<Button
						onClick={() => {
							setEditingProject(null)
							setSheetOpen(true)
						}}
					>
						<Plus className="size-4 mr-1" />
						New Project
					</Button>
				</div>
			</header>

			<div className="px-6 py-4 border-b border-border">
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2">
						<Filter className="size-4 text-muted-foreground" />
						<span className="text-sm text-muted-foreground">Filter:</span>
					</div>

					<Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ProjectStatus | 'all')}>
						<SelectTrigger className="w-[150px]">
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
										<span className="text-muted-foreground text-xs">({statusCounts[key as ProjectStatus] || 0})</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as ProjectPriority | 'all')}>
						<SelectTrigger className="w-[140px]">
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

					<div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
						<span>
							{filteredAndSortedProjects.length} project{filteredAndSortedProjects.length !== 1 ? 's' : ''}
						</span>
					</div>
				</div>
			</div>

			<div className="flex-1 overflow-auto p-6">
				<div className="rounded-lg border border-border bg-card">
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead>
									<button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-foreground">
										Project Name
										<ArrowUpDown className="size-3" />
									</button>
								</TableHead>
								<TableHead>
									<button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:text-foreground">
										Status
										<ArrowUpDown className="size-3" />
									</button>
								</TableHead>
								<TableHead>
									<button onClick={() => handleSort('priority')} className="flex items-center gap-1 hover:text-foreground">
										Priority
										<ArrowUpDown className="size-3" />
									</button>
								</TableHead>
								<TableHead>Linked Lead</TableHead>
								<TableHead>Owner</TableHead>
								<TableHead>
									<button onClick={() => handleSort('startDate')} className="flex items-center gap-1 hover:text-foreground">
										Start Date
										<ArrowUpDown className="size-3" />
									</button>
								</TableHead>
								<TableHead>
									<button onClick={() => handleSort('deliveryDate')} className="flex items-center gap-1 hover:text-foreground">
										Delivery Date
										<ArrowUpDown className="size-3" />
									</button>
								</TableHead>
								<TableHead className="w-[50px]"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredAndSortedProjects.length === 0 ? (
								<TableRow>
									<td colSpan={8} className="py-12 text-center">
										<div className="flex flex-col items-center gap-2">
											<FolderKanban className="size-8 text-muted-foreground/50" />
											<p className="text-muted-foreground">No projects found</p>
											<Button
												variant="outline"
												size="sm"
												onClick={() => {
													setEditingProject(null)
													setSheetOpen(true)
												}}
											>
												<Plus className="size-4 mr-1" />
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
