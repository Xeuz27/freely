import { atom } from 'nanostores'
import type { TimeEntry } from '@/types/timetrack-types'
import { sampleLogEntries } from '@/data/sampleLogEntries'
import { removeByPredicate } from './store'

export const state = atom({
	entries: [...sampleLogEntries]
})
export const getState = () => {
	return state.get()
}
export const setState = (value: object) => {
	const currentState = getState()
	state.set({ ...currentState, ...value })
}

export const entriesHandler = (entry: TimeEntry, toDelete = false) => {
	const currentState = getState()
	let entries = [...currentState.entries]
	const entriesIndex = entries.findIndex((e) => e.id === entry.id)

	if (toDelete) {
		entries = removeByPredicate(entries, (ev) => ev.id === entry.id)
		// to have relations
	} else {
		if (entriesIndex >= 0) {
			entries[entriesIndex] = {
				...entries[entriesIndex],
				...entry,
				updatedAt: new Date()
			}
		} else {
			entries.push({ ...entry })
		}
	}
	setState({ entries: entries })
}
