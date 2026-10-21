import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { type KanbanCard as KanbanCardType, cardTypeColors } from '@/types/kanban-types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
	CheckSquare,
	Database,
	FileText,
	GripVertical,
	Lightbulb,
	Trash2,
	ContactIcon,
	type LucideIcon
} from 'lucide-react'

interface KanbanCardProps {
	card: KanbanCardType
	onDelete: (cardId: string) => void
}

const iconMap: Record<KanbanCardType['type'], LucideIcon> = {
	task: CheckSquare,
	note: FileText,
	idea: Lightbulb,
	data: Database,
	lead: ContactIcon
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
				'group bg-card relative rounded-lg border p-4 shadow-sm transition-all hover:shadow-md',
				isDragging && 'ring-primary/50 opacity-50 shadow-lg ring-2'
			)}
		>
			<div className="flex items-start gap-3">
				<button
					{...attributes}
					{...listeners}
					className="mt-0.5 cursor-grab opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
				>
					<GripVertical className="text-muted-foreground size-4" />
				</button>
				<div className="min-w-0 flex-1">
					<div className="mb-2 flex items-center gap-2">
						<div className={cn('rounded-md p-1.5', colors.bg)}>
							<Icon className={cn('size-3.5', colors.text)} />
						</div>
						<Badge
							variant="outline"
							className={cn(
								'text-[10px] font-medium tracking-wider uppercase',
								colors.bg,
								colors.text,
								colors.border
							)}
						>
							{card.type}
						</Badge>
					</div>
					<h4 className="text-foreground mb-1 text-sm leading-snug font-medium">{card.title}</h4>
					{card.description && (
						<p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">{card.description}</p>
					)}
					{card.tags && card.tags.length > 0 && (
						<div className="mt-3 flex flex-wrap gap-1">
							{card.tags.map((tag) => (
								<span
									key={tag}
									className="bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 text-[10px]"
								>
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
					className="hover:bg-destructive/10 hover:text-destructive opacity-0 transition-opacity group-hover:opacity-100"
				>
					<Trash2 className="size-3.5" />
				</Button>
			</div>
		</div>
	)
}
