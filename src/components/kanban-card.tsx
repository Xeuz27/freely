'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { type KanbanCard as KanbanCardType, cardTypeColors } from '@/types/kanban-types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckSquare, Database, FileText, GripVertical, Lightbulb, Trash2 } from 'lucide-react'

interface KanbanCardProps {
	card: KanbanCardType
	onDelete: (cardId: string) => void
}

const iconMap = {
	task: CheckSquare,
	note: FileText,
	idea: Lightbulb,
	data: Database
}

export function KanbanCard({ card, onDelete }: KanbanCardProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	}

	const Icon = iconMap[card.type]
	const colors = cardTypeColors[card.type]

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				'group relative rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md',
				isDragging && 'opacity-50 shadow-lg ring-2 ring-primary/50'
			)}
		>
			<div className="flex items-start gap-3">
				<button
					{...attributes}
					{...listeners}
					className="mt-0.5 cursor-grab opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
				>
					<GripVertical className="size-4 text-muted-foreground" />
				</button>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-2">
						<div className={cn('rounded-md p-1.5', colors.bg)}>
							<Icon className={cn('size-3.5', colors.text)} />
						</div>
						<Badge
							variant="outline"
							className={cn('text-[10px] uppercase tracking-wider font-medium', colors.bg, colors.text, colors.border)}
						>
							{card.type}
						</Badge>
					</div>
					<h4 className="font-medium text-sm text-foreground leading-snug mb-1">{card.title}</h4>
					{card.description && <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{card.description}</p>}
					{card.tags && card.tags.length > 0 && (
						<div className="flex flex-wrap gap-1 mt-3">
							{card.tags.map((tag) => (
								<span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
									{tag}
								</span>
							))}
						</div>
					)}
				</div>
				<Button
					variant="ghost"
					size="icon-sm"
					onClick={() => onDelete(card.id)}
					className="opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
				>
					<Trash2 className="size-3.5" />
				</Button>
			</div>
		</div>
	)
}
