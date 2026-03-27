import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { type ContactStatus, type Lead, statusConfig } from '@/types/crm-types'
import { ArrowUpDown, Filter, Plus, Search, Users } from 'lucide-react'
import { useState } from 'react'
import { LeadDialog } from './lead-dialog'
import { LeadRow } from './lead-row'

export const sampleLeads: Lead[] = [
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
		name: 'Emily Watson',
		email: 'emily@designstudio.co',
		company: 'Design Studio Co.',
		status: 'new',
		note: '',
		info: 'Inbound from website form',
		createdAt: new Date('2024-01-25'),
		updatedAt: new Date('2024-01-25')
	},
	{
		id: '4',
		name: 'David Kim',
		email: 'david@globaltech.com',
		phone: '+1 (555) 456-7890',
		company: 'GlobalTech Solutions',
		status: 'negotiation',
		note: 'Discussing contract terms',
		info: 'Enterprise client, 500+ users',
		createdAt: new Date('2024-01-05'),
		updatedAt: new Date('2024-01-24')
	},
	{
		id: '5',
		name: 'Lisa Park',
		email: 'lisa@creativehub.net',
		company: 'Creative Hub',
		status: 'contacted',
		note: 'Follow up scheduled for next week',
		info: 'Agency, potential reseller partnership',
		createdAt: new Date('2024-01-18'),
		updatedAt: new Date('2024-01-21')
	}
]

type SortField = 'name' | 'status' | 'createdAt' | 'updatedAt'
type SortOrder = 'asc' | 'desc'

export let outerLeads: Lead[] = [...sampleLeads]

export function CrmBoard() {
	const [leads, setLeads] = useState<Lead[]>(sampleLeads)
	const [searchQuery, setSearchQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>('all')
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editingLead, setEditingLead] = useState<Lead | null>(null)
	const [sortField, setSortField] = useState<SortField>('updatedAt')
	const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

	const handleSaveLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
		if (leadData.id) {
			setLeads((prev) => prev.map((lead) => (lead.id === leadData.id ? { ...lead, ...leadData, updatedAt: new Date() } : lead)))
		} else {
			const newLead: Lead = {
				...leadData,
				id: crypto.randomUUID(),
				createdAt: new Date(),
				updatedAt: new Date()
			}
			outerLeads = [...outerLeads, { ...newLead }]
			setLeads((prev) => [newLead, ...prev])
		}
		setEditingLead(null)
	}

	const handleDeleteLead = (id: string) => {
		setLeads((prev) => prev.filter((lead) => lead.id !== id))
	}

	const handleUpdateLead = (updatedLead: Lead) => {
		setLeads((prev) => prev.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead)))
	}

	const handleEditLead = (lead: Lead) => {
		setEditingLead(lead)
		setDialogOpen(true)
	}

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
		} else {
			setSortField(field)
			setSortOrder('asc')
		}
	}

	const filteredAndSortedLeads = leads
		.filter((lead) => {
			const matchesSearch =
				lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				lead.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
				lead.info.toLowerCase().includes(searchQuery.toLowerCase())
			const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
			return matchesSearch && matchesStatus
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
				case 'createdAt':
					comparison = a.createdAt.getTime() - b.createdAt.getTime()
					break
				case 'updatedAt':
					comparison = a.updatedAt.getTime() - b.updatedAt.getTime()
					break
			}
			return sortOrder === 'asc' ? comparison : -comparison
		})

	const statusCounts = leads.reduce((acc, lead) => {
		acc[lead.status] = (acc[lead.status] || 0) + 1
		return acc
	}, {} as Record<ContactStatus, number>)

	return (
		<div className="flex flex-col h-screen bg-background">
			<header className="flex items-center justify-between px-6 py-4 border-b border-border">
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center size-9 rounded-lg bg-primary/10">
						<Users className="size-5 text-primary" />
					</div>
					<div>
						<h1 className="text-lg font-semibold text-foreground">CRM</h1>
						<p className="text-xs text-muted-foreground">Manage your leads and contacts</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
						<Input
							placeholder="Search leads..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9 w-64 bg-secondary/50"
						/>
					</div>
					<Button
						onClick={() => {
							setEditingLead(null)
							setDialogOpen(true)
						}}
					>
						<Plus className="size-4 mr-1" />
						Add Lead
					</Button>
				</div>
			</header>

			<div className="px-6 py-4 border-b border-border">
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2">
						<Filter className="size-4 text-muted-foreground" />
						<span className="text-sm text-muted-foreground">Filter:</span>
					</div>
					<Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ContactStatus | 'all')}>
						<SelectTrigger className="w-[150px]">
							<SelectValue placeholder="All statuses" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Statuses</SelectItem>
							{Object.entries(statusConfig).map(([key, config]) => (
								<SelectItem key={key} value={key}>
									<div className="flex items-center gap-2">
										<Badge variant="outline" className={`${config.color} border`}>
											{config.label}
										</Badge>
										<span className="text-muted-foreground text-xs">({statusCounts[key as ContactStatus] || 0})</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
						<span>{filteredAndSortedLeads.length} leads</span>
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
										Name
										<ArrowUpDown className="size-3" />
									</button>
								</TableHead>
								<TableHead>Company</TableHead>
								<TableHead>Phone</TableHead>
								<TableHead>
									<button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:text-foreground">
										Status
										<ArrowUpDown className="size-3" />
									</button>
								</TableHead>
								<TableHead>Note</TableHead>
								<TableHead>Info</TableHead>
								<TableHead className="w-[50px]"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredAndSortedLeads.length === 0 ? (
								<TableRow>
									<td colSpan={7} className="py-12 text-center">
										<div className="flex flex-col items-center gap-2">
											<Users className="size-8 text-muted-foreground/50" />
											<p className="text-muted-foreground">No leads found</p>
											<Button
												variant="outline"
												size="sm"
												onClick={() => {
													setEditingLead(null)
													setDialogOpen(true)
												}}
											>
												<Plus className="size-4 mr-1" />
												Add your first lead
											</Button>
										</div>
									</td>
								</TableRow>
							) : (
								filteredAndSortedLeads.map((lead) => (
									<LeadRow
										key={lead.id}
										lead={lead}
										onDelete={handleDeleteLead}
										onUpdate={handleUpdateLead}
										onEdit={handleEditLead}
									/>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			<LeadDialog open={dialogOpen} onOpenChange={setDialogOpen} onSave={handleSaveLead} editLead={editingLead} />
		</div>
	)
}
