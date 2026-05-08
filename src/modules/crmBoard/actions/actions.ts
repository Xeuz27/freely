import { leadsHandler } from '@/store/store'
import type { Lead } from '@/types/crm-types'

export const handleSaveLead = (leadData: Partial<Lead>) => {
	let lead = leadData
	if (!leadData.id) {
		lead = {
			...leadData,
			id: crypto.randomUUID().split('-')[0],
			createdAt: new Date()
		}
	} else {
		lead = {
			...leadData,
			updatedAt: new Date()
		}
	}
	leadsHandler(lead as Lead)
	return lead
}
export const handleDeleteLead = (lead: Lead) => {
	leadsHandler(lead, true)
}
