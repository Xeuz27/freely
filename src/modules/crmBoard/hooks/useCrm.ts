import usePersist from '@/modules/core/hooks/usePersist.ts'
import type { ContactStatus, Lead } from '@/types/crm-types'
import { useStore } from '@nanostores/react'
import { useEffect, useState } from 'react'
import { leadsHandler, setState, state } from '../../../store/store.ts'

export const useCrm = () => {
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editingLead, setEditingLead] = useState<Lead | null>(null)
	// const [sortField, setSortField] = useState<SortField>('updatedAt')
	// const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

	const $state = useStore(state)
	const { leads } = $state
	usePersist('leads', leads, (leads: Lead[]) => {
		setState({
			leads: leads.map((lead) => ({
				...lead,
				createdAt: new Date(lead.createdAt),
				updatedAt: new Date(lead.updatedAt)
			}))
		})
	})

	const setLeads = (lead: Lead, toDelete = false) => {
		toDelete ? leadsHandler(lead, toDelete) : leadsHandler(lead)
	}
	useEffect(() => {
		if (dialogOpen === false) setEditingLead(null)
	}, [dialogOpen])

	const statusCounts = leads.reduce((acc, lead) => {
		acc[lead.status] = (acc[lead.status] || 0) + 1
		return acc
	}, {} as Record<ContactStatus, number>)

	return {
		leads,
		setLeads,

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
