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
		<div className={cn('flex flex-col h-full min-h-[500px] shrink-0 rounded-xl bg-secondary/30 border border-border/50')}>
			<div className="flex items-center justify-between p-4 border-b border-border/50">
				<div className="flex items-center gap-2">
					<h3 className="font-semibold text-sm text-foreground">{column.title}</h3>
					<span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{column.cards.length}</span>
				</div>
				<div className="flex items-center gap-1">
					<Button variant="ghost" size="icon-sm" onClick={() => onAddCard(column.id)} className="hover:bg-primary/10 hover:text-primary">
						<Plus className="size-4" />
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon-sm">
								<MoreHorizontal className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => onDeleteColumn(column.id)} className="text-destructive focus:text-destructive">
								<Trash2 className="size-4 mr-2" />
								Delete Column
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<div ref={setNodeRef} className={cn('flex-1 p-3 space-y-3 overflow-y-auto transition-colors', isOver && 'bg-primary/5')}>
				<SortableContext items={column.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
					{column.cards.map((card) => (
						<KanbanCard key={card.id} card={card} onDelete={onDeleteCard} />
					))}
				</SortableContext>

				{column.cards.length === 0 && (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<p className="text-xs text-muted-foreground mb-3">No items yet</p>
						<Button variant="outline" size="sm" onClick={() => onAddCard(column.id)} className="text-xs">
							<Plus className="size-3 mr-1" />
							Add Item
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}
