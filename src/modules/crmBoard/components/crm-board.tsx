import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WorkspaceHeader } from '@/modules/core/components/workspace-Header'
import { state } from '@/store/store'
import { type ContactStatus, statusConfig } from '@/types/crm-types'
import { useStore } from '@nanostores/react'
import { Filter, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import useCrmContext from '../hooks/useCrmContext'
import { LeadDialog } from './lead-dialog'
import LeadTable from './lead-table'

export function CrmBoard() {
	const $store = useStore(state)
	const { eventLinks, leads } = $store

	const [searchQuery, setSearchQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>('all')
	const [data, setData] = useState(leads)

	const {
		dialogOpen,
		setDialogOpen,
		editingLead,
		setEditingLead,
		statusCounts
	} = useCrmContext()

	useEffect(() => {
		setData(leads)
	}, [leads])
	useEffect(() => {
		filterLeads()
	}, [searchQuery, statusFilter])

	const filterLeads = () => {
		let d = leads.filter((lead) => {
			const matchesSearch =
				lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				lead.company
					?.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				lead.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				lead.info?.toLowerCase().includes(searchQuery.toLowerCase())
			const matchesStatus =
				statusFilter === 'all' || lead.status === statusFilter
			return matchesSearch && matchesStatus
		})
		setData(d)
	}

	const eventsLinked = (leadId: string) => {
		let eventslinked = eventLinks.filter((e) => e.leadId === leadId)
		return eventslinked[0] ?? null
	}
	return (
		<div className="flex flex-1 flex-col px-4 h-screen bg-background">
			<WorkspaceHeader>
				<WorkspaceHeader.Content 
					title="CRM" 
					description="Manage your leads and contacts" 
					Icon={User} />
				<WorkspaceHeader.Actions>
					<WorkspaceHeader.Search 
						placeholder="Search Leads..." 
						onSearch={setSearchQuery} 
						value={searchQuery} />
					<WorkspaceHeader.Button
						text="Add Lead"
						onClick={() => {
							setEditingLead(null)
							setDialogOpen(true)
						}}
					/>
				</WorkspaceHeader.Actions>
			</WorkspaceHeader>

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
						<span>{data.length} leads</span>
					</div>
				</div>
			</div>

			<div className="flex-1 overflow-auto p-6">
				<div className="rounded-lg border border-border bg-card">
					<LeadTable data={data} />
				</div>
			</div>
			{dialogOpen && <LeadDialog open={dialogOpen} onOpenChange={setDialogOpen} editLead={editingLead} eventsLinked={eventsLinked} />}
		</div>
	)
}
