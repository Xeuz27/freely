import type { ContactStatus, Lead } from '@/types/crm-types'
import { createContext, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { useCrm } from '../hooks/useCrm'

type CrmContext = {
	leads: Lead[]
	// setLeads: (lead: Lead, toDelete?: boolean) => void
	dialogOpen: boolean
	setDialogOpen: Dispatch<SetStateAction<boolean>>
	editingLead: Lead | null
	setEditingLead: Dispatch<SetStateAction<Lead | null>>
	statusCounts: Record<ContactStatus, number>
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
