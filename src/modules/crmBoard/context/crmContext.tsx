import type { ContactStatus, Lead, SortField, SortOrder } from '@/types/crm-types'
import { createContext, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { useCrm } from '../hooks/useCrm'

type CrmContext = {
	leads: Lead[]
	setLeads: (lead: Lead, toDelete?: boolean) => void
	searchQuery: string
	setSearchQuery: Dispatch<SetStateAction<string>>
	statusFilter: ContactStatus | 'all'
	setStatusFilter: Dispatch<SetStateAction<ContactStatus | 'all'>>
	dialogOpen: boolean
	setDialogOpen: Dispatch<SetStateAction<boolean>>
	editingLead: Lead | null
	setEditingLead: Dispatch<SetStateAction<Lead | null>>
	sortField: SortField
	setSortField: Dispatch<SetStateAction<SortField>>
	sortOrder: SortOrder
	setSortOrder: Dispatch<SetStateAction<SortOrder>>
	filteredAndSortedLeads: Lead[]
	statusCounts: Record<ContactStatus, number>
	handleSort: (field: SortField) => void
	handleEditLead: (lead: Lead) => void
	handleUpdateLead: (updatedLead: Lead) => void
	handleDeleteLead: (lead: Lead) => void
	handleSaveLead: (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void
}
type props = {
	children: ReactNode
}

export const CrmContext = createContext<CrmContext | null>(null)

const CrmContextProvider = ({ children }: props) => {
	const values = useCrm()

	return <CrmContext.Provider value={values}>{children}</CrmContext.Provider>
}

export default CrmContextProvider
