import type { DragStartEvent, DragOverEvent, DragEndEvent } from 'node_modules/@dnd-kit/core/dist'
import { arrayMove } from '@dnd-kit/sortable/dist'
import useKanbanContext from './useKanbanContext'
import type { CardType, KanbanCard as KanbanCardType, KanbanColumn as KanbanColumnType } from '@/types/kanban-types'

const useHandlers = () => {
	const {
		findColumnByCardId,
		setActiveCard,
		columns,
		setColumns,
		setTargetColumnId,
		setAddCardDialogOpen,
		targetColumnId
	} = useKanbanContext()

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event
		const column = findColumnByCardId(active.id as string)
		const card = column?.cards.find((c) => c.id === active.id)
		if (card) {
			setActiveCard(card)
		}
	}

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event
		if (!over) return

		const activeId = active.id as string
		const overId = over.id as string

		const activeColumn = findColumnByCardId(activeId)
		const overColumn = findColumnByCardId(overId) || columns.find((col) => col.id === overId)

		if (!activeColumn || !overColumn) return
		if (activeColumn.id === overColumn.id) return

		setColumns((prev) => {
			const activeCards = [...activeColumn.cards]
			const overCards = [...overColumn.cards]

			const activeIndex = activeCards.findIndex((c) => c.id === activeId)
			const [movedCard] = activeCards.splice(activeIndex, 1)

			const overCardIndex = overCards.findIndex((c) => c.id === overId)
			const insertIndex = overCardIndex >= 0 ? overCardIndex : overCards.length
			overCards.splice(insertIndex, 0, movedCard)

			return prev.map((col) => {
				if (col.id === activeColumn.id) {
					return { ...col, cards: activeCards }
				}
				if (col.id === overColumn.id) {
					return { ...col, cards: overCards }
				}
				return col
			})
		})
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		setActiveCard(null)

		if (!over) return

		const activeId = active.id as string
		const overId = over.id as string

		if (activeId === overId) return

		const activeColumn = findColumnByCardId(activeId)
		if (!activeColumn) return

		const activeIndex = activeColumn.cards.findIndex((c) => c.id === activeId)
		const overIndex = activeColumn.cards.findIndex((c) => c.id === overId)

		if (activeIndex !== -1 && overIndex !== -1) {
			setColumns((prev) =>
				prev.map((col) => {
					if (col.id === activeColumn.id) {
						return {
							...col,
							cards: arrayMove(col.cards, activeIndex, overIndex)
						}
					}
					return col
				})
			)
		}
	}

	const handleAddCard = (columnId: string) => {
		setTargetColumnId(columnId)
		setAddCardDialogOpen(true)
	}

	const handleCreateCard = (cardData: { title: string; description: string; type: CardType; tags: string[] }) => {
		if (!targetColumnId) return

		const newCard: KanbanCardType = {
			id: crypto.randomUUID(),
			...cardData,
			createdAt: new Date()
		}

		setColumns((prev) =>
			prev.map((col) => {
				if (col.id === targetColumnId) {
					return { ...col, cards: [...col.cards, newCard] }
				}
				return col
			})
		)
		setTargetColumnId(null)
	}

	const handleDeleteCard = (cardId: string) => {
		setColumns((prev) =>
			prev.map((col) => ({
				...col,
				cards: col.cards.filter((card) => card.id !== cardId)
			}))
		)
	}

	const handleAddColumn = (title: string) => {
		const newColumn: KanbanColumnType = {
			id: crypto.randomUUID(),
			title,
			cards: []
		}
		setColumns((prev) => [...prev, newColumn])
	}

	const handleDeleteColumn = (columnId: string) => {
		setColumns((prev) => prev.filter((col) => col.id !== columnId))
	}

	return {
		handleDragStart,
		handleDragOver,
		handleDragEnd,
		handleAddCard,
		handleCreateCard,
		handleDeleteCard,
		handleAddColumn,
		handleDeleteColumn
	}
}
export { useHandlers }
