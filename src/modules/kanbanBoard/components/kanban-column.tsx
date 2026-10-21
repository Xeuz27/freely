import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { KanbanColumn as KanbanColumnType } from '@/types/kanban-types'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { KanbanCard } from './kanban-card'

interface KanbanColumnProps {
	column: KanbanColumnType
	onAddCard: (columnId: string) => void
	onDeleteCard: (cardId: string) => void
	onDeleteColumn: (columnId: string) => void
}

export function KanbanColumn({ column, onAddCard, onDeleteCard, onDeleteColumn }: KanbanColumnProps) {
	const { setNodeRef, isOver } = useDroppable({
		id: column.id
	})

	return (
		<div
			className={cn(
				'bg-secondary/30 border-border/50 flex h-full min-h-[500px] shrink-0 flex-col rounded-xl border'
			)}
		>
			<div className="border-border/50 flex items-center justify-between border-b p-4">
				<div className="flex items-center gap-2">
					<h3 className="text-foreground text-sm font-semibold">{column.title}</h3>
					<span className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-xs">
						{column.cards.length}
					</span>
				</div>
				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={() => onAddCard(column.id)}
						className="hover:bg-primary/10 hover:text-primary"
					>
						<Plus className="size-4" />
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon-sm">
								<MoreHorizontal className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => onDeleteColumn(column.id)}
								className="text-destructive focus:text-destructive"
							>
								<Trash2 className="mr-2 size-4" />
								Delete Column
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<div
				ref={setNodeRef}
				className={cn('flex-1 space-y-3 overflow-y-auto p-3 transition-colors', isOver && 'bg-primary/5')}
			>
				<SortableContext items={column.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
					{column.cards.map((card) => (
						<KanbanCard key={card.id} card={card} onDelete={onDeleteCard} />
					))}
				</SortableContext>

				{column.cards.length === 0 && (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<p className="text-muted-foreground mb-3 text-xs">No items yet</p>
						<Button variant="outline" size="sm" onClick={() => onAddCard(column.id)} className="text-xs">
							<Plus className="mr-1 size-3" />
							Add Item
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}
