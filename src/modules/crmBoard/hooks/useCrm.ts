import { sampleLeads } from '@/data/sampleLeads'
import type { ContactStatus, Lead, SortField, SortOrder } from '@/types/crm-types'
import { useState } from 'react'
import { outerLeads } from '../components/crm-board'

export const useCrm = () => {
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
			let outerLeads2 = [...outerLeads, { ...newLead }]
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
