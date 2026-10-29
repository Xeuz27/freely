import type { KanbanCard as KanbanCardType, KanbanColumn as KanbanColumnType } from '@/types/kanban-types'
import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useCallback, useState } from 'react'
import { initialColumns } from 'src/data/sampleKanbanCards'

const allCards = initialColumns.map((columns) => columns.cards).flat()

const useKanban = () => {
	const [columns, setColumns] = useState<KanbanColumnType[]>(initialColumns)
	const [kanbanCards, setKanbanCards] = useState(allCards)
	const [activeCard, setActiveCard] = useState<KanbanCardType | null>(null)
	const [addCardDialogOpen, setAddCardDialogOpen] = useState(false)
	const [addColumnDialogOpen, setAddColumnDialogOpen] = useState(false)
	const [targetColumnId, setTargetColumnId] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState('')

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8
			}
		})
	)

	const findColumnByCardId = useCallback(
		(cardId: string) => {
			return columns.find((col) => col.cards.some((card) => card.id === cardId))
		},
		[columns]
	)

	const filteredColumns = columns.map((col) => ({
		...col,
		cards: col.cards.filter(
			(card) =>
				card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				card.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				card.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
		)
	}))

	return {
		columns,
		activeCard,
		addCardDialogOpen,
		addColumnDialogOpen,
		targetColumnId,
		searchQuery,

		setColumns,
		setActiveCard,
		setAddCardDialogOpen,
		setAddColumnDialogOpen,
		setTargetColumnId,
		setSearchQuery,

		sensors,
		findColumnByCardId,
		filteredColumns,

		kanbanCards,
		setKanbanCards
	}
}
export default useKanban
