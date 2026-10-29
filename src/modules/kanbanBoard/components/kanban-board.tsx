import { cn } from '@/lib/utils.ts'
import { closestCorners, DndContext, DragOverlay } from '@dnd-kit/core'
import { LayoutGrid, Plus } from 'lucide-react'
import { AddCardDialog } from './add-card-dialog.tsx'
import { AddColumnDialog } from './add-column-dialog.tsx'
import { KanbanCard } from './kanban-card.tsx'
import { KanbanColumn } from './kanban-column.tsx'
import { WorkspaceHeader } from '@/modules/core/components/workspace-Header.tsx'
import useKanbanContext from '../hooks/useKanbanContext.ts'
import { useHandlers } from '../hooks/useHandlers.ts'

export function KanbanBoard() {
	const {
		searchQuery,
		setSearchQuery,
		setAddCardDialogOpen,
		setAddColumnDialogOpen,
		sensors,
		filteredColumns,
		activeCard,
		addCardDialogOpen,
		addColumnDialogOpen
	} = useKanbanContext()
	const {
		handleDragStart,
		handleDragOver,
		handleDragEnd,
		handleAddCard,
		handleCreateCard,
		handleDeleteCard,
		handleAddColumn,
		handleDeleteColumn
	} = useHandlers()

	const cols = (n: number) => {
		return `grid-cols-${n + 1}`
	}
	return (
		<div className="bg-background flex h-screen flex-1 flex-col px-4">
			<WorkspaceHeader>
				<WorkspaceHeader.Content
					title="Workspace"
					description="Organize your tasks, notes, and ideas"
					Icon={LayoutGrid}
				/>
				<WorkspaceHeader.Actions>
					<WorkspaceHeader.Search placeholder="Search Items" value={searchQuery} onSearch={setSearchQuery} />
					<WorkspaceHeader.Button text="Add Column" onClick={() => setAddColumnDialogOpen} />
				</WorkspaceHeader.Actions>
			</WorkspaceHeader>

			<div className="flex-1">
				<DndContext
					sensors={sensors}
					collisionDetection={closestCorners}
					onDragStart={handleDragStart}
					onDragOver={handleDragOver}
					onDragEnd={handleDragEnd}
				>
					<div className={cn('grid h-full gap-4', cols(filteredColumns.length))}>
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
							className="border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary flex min-h-50 shrink-0 items-center justify-center rounded-xl border-2 border-dashed transition-colors"
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

			<AddColumnDialog
				open={addColumnDialogOpen}
				onOpenChange={setAddColumnDialogOpen}
				onAddColumn={handleAddColumn}
			/>
		</div>
	)
}
