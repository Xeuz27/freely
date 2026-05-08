import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { state } from '@/store/store'
import { type ContactStatus, statusConfig } from '@/types/crm-types'
import { useStore } from '@nanostores/react'
import { Filter, Plus, Search, Users } from 'lucide-react'
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
		<div className="flex flex-1 flex-col h-screen bg-background">
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
