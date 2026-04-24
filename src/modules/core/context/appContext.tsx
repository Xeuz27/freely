// import type { ContactStatus, Lead, SortField, SortOrder } from '@/types/crm-types'
import React, { type ReactNode } from 'react'
// import { useCrm } from '../hooks/useCrm'

// type CrmContext = {
// 	leads: Lead[]
// 	setLeads: (lead: Lead, toDelete?: boolean) => void
// 	searchQuery: string
// 	setSearchQuery: Dispatch<SetStateAction<string>>
// 	statusFilter: ContactStatus | 'all'
// 	setStatusFilter: Dispatch<SetStateAction<ContactStatus | 'all'>>
// 	dialogOpen: boolean
// 	setDialogOpen: Dispatch<SetStateAction<boolean>>
// 	editingLead: Lead | null
// 	setEditingLead: Dispatch<SetStateAction<Lead | null>>
// 	sortField: SortField
// 	setSortField: Dispatch<SetStateAction<SortField>>
// 	sortOrder: SortOrder
// 	setSortOrder: Dispatch<SetStateAction<SortOrder>>
// 	filteredAndSortedLeads: Lead[]
// 	statusCounts: Record<ContactStatus, number>
// 	handleSort: (field: SortField) => void
// 	handleEditLead: (lead: Lead) => void
// 	handleUpdateLead: (updatedLead: Lead) => void
// 	handleDeleteLead: (lead: Lead) => void
// 	handleSaveLead: (leadData: Lead) => void
// }
type props = {
	children: ReactNode
}

// export const CrmContext = createContext<CrmContext | null>(null)
// export const AppContext = createContext<'' | null>(null)
export const AppContext = React.createContext<'' | null>(null)

const AppContextProvider = ({ children }: props) => {
	// const values = useCrm()

	return <AppContext.Provider value={''}>{children}</AppContext.Provider>
}

export default AppContextProvider
