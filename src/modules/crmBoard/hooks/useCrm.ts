import usePersist from '@/modules/core/hooks/usePersist.ts'
import type { ContactStatus, Lead } from '@/types/crm-types'
import { useStore } from '@nanostores/react'
import { useState } from 'react'
import { setState, state } from '../../../store/store.ts'

export const useCrm = () => {
	const $state = useStore(state)
	const { leads } = $state

	const [dialogOpen, setDialogOpen] = useState(false)
	const [editingLead, setEditingLead] = useState<Lead | null>(null)

	usePersist('leads', leads, (leads: Lead[]) => {
		setState({
			leads: leads.map((lead) => ({
				...lead,
				createdAt: new Date(lead.createdAt),
				updatedAt: new Date(lead.updatedAt)
			}))
		})
	})

	const statusCounts = leads.reduce((acc, lead) => {
		acc[lead.status] = (acc[lead.status] || 0) + 1
		return acc
	}, {} as Record<ContactStatus, number>)

	return {
		leads,
		// setLeads,

		dialogOpen,
		setDialogOpen,
		editingLead,
		setEditingLead,

		// sortField,
		// setSortField,
		// sortOrder,
		// setSortOrder,

		// filteredAndSortedLeads,
		statusCounts
		// handleSort,
		// handleEditLead,
		// handleUpdateLead,
		// handleDeleteLead,
		// handleSaveLead
	}
}
