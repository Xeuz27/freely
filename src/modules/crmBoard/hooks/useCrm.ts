import usePersist from '@/modules/core/hooks/usePersist'
import type { ContactStatus, Lead, SortField, SortOrder } from '@/types/crm-types'
import { useStore } from '@nanostores/react'
import { useEffect, useState } from 'react'
import { crmState, leadsHandler, setCrmState } from '../reducer/crmState'

const setState = (leads: Lead[]) => {
	setCrmState({ leads: leads.map((lead) => ({ ...lead, createdAt: new Date(lead.createdAt), updatedAt: new Date(lead.updatedAt) })) })
}
export const useCrm = () => {
	const [searchQuery, setSearchQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>('all')
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editingLead, setEditingLead] = useState<Lead | null>(null)
	const [sortField, setSortField] = useState<SortField>('updatedAt')
	const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

	const $crmState = useStore(crmState)
	const { leads } = $crmState

	usePersist('leads', leads, setState)

	const setLeads = (lead: Lead, toDelete = false) => {
		toDelete ? leadsHandler(lead, toDelete) : leadsHandler(lead)
	}
	useEffect(() => {
		if (dialogOpen === false) setEditingLead(null)
	}, [dialogOpen])

	const handleSaveLead = (leadData: Lead) => {
		if (leadData.id) {
			leadsHandler(leadData)
		} else {
			const newLead: Lead = {
				...leadData,
				id: crypto.randomUUID().split('-')[0],
				createdAt: new Date(),
				updatedAt: new Date()
			}
			leadsHandler(newLead)
		}
		setEditingLead(null)
	}

	const handleDeleteLead = (lead: Lead) => {
		leadsHandler(lead, true)
	}

	const handleUpdateLead = (updatedLead: Lead) => {
		leadsHandler(updatedLead)
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
				lead.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				lead.info?.toLowerCase().includes(searchQuery.toLowerCase())
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

	return {
		leads,
		setLeads,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		dialogOpen,
		setDialogOpen,
		editingLead,
		setEditingLead,
		sortField,
		setSortField,
		sortOrder,
		setSortOrder,

		filteredAndSortedLeads,
		statusCounts,
		handleSort,
		handleEditLead,
		handleUpdateLead,
		handleDeleteLead,
		handleSaveLead
	}
}
