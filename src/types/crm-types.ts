export type ContactStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'

export type SortField = 'name' | 'status' | 'createdAt' | 'updatedAt'
export type SortOrder = 'asc' | 'desc'

export interface Lead {
	id: string
	name: string
	email?: string
	phone?: string
	company?: string
	status: ContactStatus
	note: string
	info: string
	createdAt: Date
	updatedAt: Date
}

export const statusConfig: Record<ContactStatus, { label: string; color: string }> = {
	new: { label: 'New', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
	contacted: { label: 'Contacted', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
	qualified: { label: 'Qualified', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
	proposal: { label: 'Proposal', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
	negotiation: { label: 'Negotiation', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
	won: { label: 'Won', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
	lost: { label: 'Lost', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
}
