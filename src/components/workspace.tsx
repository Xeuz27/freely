'use client'

import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, LayoutGrid, Users } from 'lucide-react'
import { useState } from 'react'
import { CrmBoard } from './crm-board.tsx'
import { KanbanBoard } from './kanban-board.tsx'

type View = 'kanban' | 'crm'

export function Workspace() {
	const [activeView, setActiveView] = useState<View>('kanban')
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

	const navItems = [
		{ id: 'kanban' as View, label: 'Kanban Board', icon: LayoutGrid },
		{ id: 'crm' as View, label: 'CRM', icon: Users }
	]

	return (
		<div className="flex h-screen bg-background">
			<aside
				className={cn(
					'relative flex flex-col border-r border-border bg-sidebar transition-all duration-300',
					sidebarCollapsed ? 'w-16' : 'w-56'
				)}
			>
				<div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border">
					{!sidebarCollapsed && (
						<div className="flex items-center gap-2">
							<div className="size-7 rounded-lg bg-primary flex items-center justify-center">
								<span className="text-sm font-bold text-primary-foreground">W</span>
							</div>
							<span className="font-semibold text-sidebar-foreground">Workspace</span>
						</div>
					)}
					{sidebarCollapsed && (
						<div className="size-7 rounded-lg bg-primary flex items-center justify-center mx-auto">
							<span className="text-sm font-bold text-primary-foreground">W</span>
						</div>
					)}
				</div>

				<nav className="flex-1 p-2">
					<ul className="space-y-1">
						{navItems.map((item) => (
							<li key={item.id}>
								<button
									onClick={() => setActiveView(item.id)}
									className={cn(
										'flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm transition-colors',
										activeView === item.id
											? 'bg-sidebar-accent text-sidebar-accent-foreground'
											: 'text-sidebar-foreground hover:bg-sidebar-accent/50'
									)}
								>
									<item.icon className={cn('size-5 shrink-0', activeView === item.id ? 'text-sidebar-primary' : '')} />
									{!sidebarCollapsed && <span>{item.label}</span>}
								</button>
							</li>
						))}
					</ul>
				</nav>

				<button
					onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
					className="absolute -right-3 top-1/2 -translate-y-1/2 flex items-center justify-center size-6 rounded-full bg-secondary border border-border hover:bg-accent transition-colors"
				>
					{sidebarCollapsed ? <ChevronRight className="size-3" /> : <ChevronLeft className="size-3" />}
				</button>
			</aside>

			<main className="flex-1 overflow-hidden">
				{activeView === 'kanban' && <KanbanBoard />}
				{activeView === 'crm' && <CrmBoard />}
			</main>
		</div>
	)
}
