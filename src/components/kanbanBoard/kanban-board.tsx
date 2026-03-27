'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { CardType, KanbanCard as KanbanCardType, KanbanColumn as KanbanColumnType } from '@/types/kanban-types'
import {
	closestCorners,
	DndContext,
	type DragEndEvent,
	type DragOverEvent,
	DragOverlay,
	type DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { LayoutGrid, Plus, Search } from 'lucide-react'
import { useCallback, useState } from 'react'
import { AddCardDialog } from './add-card-dialog.tsx'
import { AddColumnDialog } from './add-column-dialog.tsx'
import { KanbanCard } from './kanban-card.tsx'
import { KanbanColumn } from './kanban-column.tsx'

const initialColumns: KanbanColumnType[] = [
	{
		id: 'backlog',
		title: 'Backlog',
		cards: [
			{
				id: '1',
				title: 'Research competitor pricing',
				description: 'Analyze pricing strategies of top 5 competitors',
				type: 'task',
				createdAt: new Date(),
				tags: ['research', 'priority']
			},
			{
				id: '2',
				title: 'Meeting notes - Q1 Planning',
				description: 'Key decisions from the quarterly planning session',
				type: 'note',
				createdAt: new Date(),
				tags: ['meeting']
			}
		]
	},
	{
		id: 'in-progress',
		title: 'In Progress',
		cards: [
			{
				id: '3',
				title: 'New onboarding flow',
				description: 'Redesign the user onboarding experience with interactive tutorials',
				type: 'idea',
				createdAt: new Date(),
				tags: ['ux', 'feature']
			}
		]
	},
	{
		id: 'review',
		title: 'Review',
		cards: [
			{
				id: '4',
				title: 'API performance metrics',
				description: 'Response times and error rates for the past 30 days',
				type: 'data',
				createdAt: new Date(),
				tags: ['metrics']
			}
		]
	},
	{
		id: 'done',
		title: 'Done',
		cards: []
	}
]

export function KanbanBoard() {
	const [columns, setColumns] = useState<KanbanColumnType[]>(initialColumns)
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

	const filteredColumns = columns.map((col) => ({
		...col,
		cards: col.cards.filter(
			(card) =>
				card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				card.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				card.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
		)
	}))

	return (
		<div className="flex flex-col h-screen bg-background">
			<header className="flex items-center justify-between px-6 py-4 border-b border-border">
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center size-9 rounded-lg bg-primary/10">
						<LayoutGrid className="size-5 text-primary" />
					</div>
					<div>
						<h1 className="text-lg font-semibold text-foreground">Workspace</h1>
						<p className="text-xs text-muted-foreground">Organize your tasks, notes, and ideas</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<div className="relative ">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
						<Input
							placeholder="Search items..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9 w-64 bg-secondary/50"
						/>
					</div>
					<Button onClick={() => setAddColumnDialogOpen(true)}>
						<Plus className="size-4 mr-1" />
						Add Column
					</Button>
				</div>
			</header>

			<div className="flex-1 overflow-x-auto p-6">
				<DndContext
					sensors={sensors}
					collisionDetection={closestCorners}
					onDragStart={handleDragStart}
					onDragOver={handleDragOver}
					onDragEnd={handleDragEnd}
				>
					<div className="flex gap-4 h-full">
						{filteredColumns.map((column) => (
							<KanbanColumn
								key={column.id}
								column={column}
								onAddCard={handleAddCard}
								onDeleteCard={handleDeleteCard}
								onDeleteColumn={handleDeleteColumn}
							/>
						))}

						<button
							onClick={() => setAddColumnDialogOpen(true)}
							className="flex items-center justify-center w-[320px] min-h-[200px] shrink-0 rounded-xl border-2 border-dashed border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
						>
							<div className="flex flex-col items-center gap-2">
								<Plus className="size-6" />
								<span className="text-sm font-medium">Add Column</span>
							</div>
						</button>
					</div>

					<DragOverlay>
						{activeCard && (
							<div className="opacity-90">
								<KanbanCard card={activeCard} onDelete={() => {}} />
							</div>
						)}
					</DragOverlay>
				</DndContext>
			</div>

			<AddCardDialog open={addCardDialogOpen} onOpenChange={setAddCardDialogOpen} onAddCard={handleCreateCard} />

			<AddColumnDialog open={addColumnDialogOpen} onOpenChange={setAddColumnDialogOpen} onAddColumn={handleAddColumn} />
		</div>
	)
}
