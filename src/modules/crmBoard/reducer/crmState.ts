import { sampleLeads } from '@/data/sampleLeads'
import type { Lead } from '@/types/crm-types'
import { atom } from 'nanostores'

export const crmState = atom({
	leads: [...sampleLeads],
	editingLead: null
})
export const getCrmState = () => {
	return crmState.get()
}
export const setCrmState = (value: Object) => {
	let currentState = getCrmState()
	crmState.set({ ...currentState, ...value })
}
export const leadsHandler = (lead: Lead, toDelete = false) => {
	let currentState = getCrmState()

	let leadIndex = currentState.leads.findIndex((l) => l.id === lead.id)
	let leads = [...currentState.leads]
	if (toDelete) {
		leads = leads.filter((l) => l.id != lead.id)
	} else {
		leadIndex >= 0 ? (leads[leadIndex] = { ...leads[leadIndex], ...lead, updatedAt: new Date() }) : leads.push({ ...lead })
	}

	setCrmState({ leads: leads })
}
