import { createContext, type ReactNode, type Dispatch, type SetStateAction } from 'react'

import type { KanbanCard as KanbanCardType, KanbanColumn as KanbanColumnType } from '@/types/kanban-types'
import type { SensorDescriptor, SensorOptions } from '@dnd-kit/core'
import useKanban from '../hooks/useKanban'

type KanbanContext = {
	columns: KanbanColumnType[]
	activeCard: KanbanCardType | null
	addCardDialogOpen: boolean
	addColumnDialogOpen: boolean
	targetColumnId: string | null
	searchQuery: string
	setColumns: Dispatch<SetStateAction<KanbanColumnType[]>>
	setActiveCard: Dispatch<SetStateAction<KanbanCardType | null>>
	setAddCardDialogOpen: Dispatch<SetStateAction<boolean>>
	setAddColumnDialogOpen: Dispatch<SetStateAction<boolean>>
	setTargetColumnId: Dispatch<SetStateAction<string | null>>
	setSearchQuery: Dispatch<SetStateAction<string>>
	sensors: SensorDescriptor<SensorOptions>[]
	findColumnByCardId: (cardId: string) => KanbanColumnType | undefined
	filteredColumns: {
		cards: KanbanCardType[]
		id: string
		title: string
	}[]
	kanbanCards: KanbanCardType[]
	setKanbanCards: Dispatch<SetStateAction<KanbanCardType[]>>
}

type props = {
	children: ReactNode
}

export const KanbanContext = createContext<KanbanContext | null>(null)

const KanbanContextProvider = ({ children }: props) => {
	const values = useKanban()

	return <KanbanContext.Provider value={values}>{children}</KanbanContext.Provider>
}

export default KanbanContextProvider
