export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'review' | 'completed' | 'cancelled'
export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Project {
	id: string
	name: string
	description?: string
	status: ProjectStatus
	priority: ProjectPriority
	ownerId?: string
	leadId?: string
	startDate: Date
	deliveryDate: Date
	createdAt: Date
	updatedAt: Date
}

export const projectStatusConfig: Record<ProjectStatus, { label: string; color: string }> = {
	planning: { label: 'Planning', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
	in_progress: { label: 'In Progress', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
	on_hold: { label: 'On Hold', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
	review: { label: 'Review', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
	completed: { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
	cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
}

export const projectPriorityConfig: Record<ProjectPriority, { label: string; color: string }> = {
	low: { label: 'Low', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
	medium: { label: 'Medium', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
	high: { label: 'High', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
	urgent: { label: 'Urgent', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
}
