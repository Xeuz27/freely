import { atom } from 'nanostores'
import { initialEntries, type TimeEntry } from 'src/types/timetrack-types'

// const removeByPredicate = (list: eventLink[] | Lead[], predicate: (l: eventLink | Lead) => boolean ) => list.filter((l) => !predicate(l))

export const state = atom({
    entries: [...initialEntries]
})
export const getState = () => {
    return state.get()
}
export const setState = (value: Object) => {
    let currentState = getState()
    state.set({ ...currentState, ...value })
}

export const entriesHandler = (entry: TimeEntry, toDelete = false) => {
    let currentState = getState()
    let entries = [...currentState.entries]
    let entriesIndex = entries.findIndex((e) => e.id === entry.id)

    if (toDelete) {
        //@ts-ignore
        entries = removeByPredicate(entries, (ev) => ev.id === entry.id)
        // linksHandler({ id: entry.id, key: 'eventId' })
    } else {
        entriesIndex >= 0
        ? (entries[entriesIndex] = {
            ...entries[entriesIndex],
            ...entry,
            updatedAt: new Date()
        })
        : entries.push({ ...entry })
    }
    setState({ entries: entries })
}