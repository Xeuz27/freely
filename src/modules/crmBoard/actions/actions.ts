import { leadsHandler } from '@/store/store'
import type { Lead } from '@/types/crm-types'

export const handleSaveLead = (leadData: Lead) => {
	let lead: Lead = leadData
	if (!leadData.id) {
		lead = {
			...leadData,
			id: crypto.randomUUID().split('-')[0],
			createdAt: new Date(),
			updatedAt: new Date()
		}
	}
	leadsHandler(lead)
	return lead
}

export const handleDeleteLead = (lead: Lead) => {
	leadsHandler(lead, true)
}
