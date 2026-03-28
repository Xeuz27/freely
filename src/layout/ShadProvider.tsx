import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { CalendarBoard } from '@/modules/calendarBoard/components/calendar-board.tsx'
import { AppSidebar } from '@/modules/core/components/sidebar/app-sidebar.tsx'
import { CrmBoard } from '@/modules/crmBoard/components/crm-board'
import { DocumentBoard } from '@/modules/documentBoard/components/document-board'
import { KanbanBoard } from '@/modules/kanbanBoard/components/kanban-board'
import { ProjectBoard } from '@/modules/projectBoard/components/project-board'
import { TimetrackBoard } from '@/modules/timeTrackBoard/components/timetrack-board'
import { useState } from 'react'

export type View = 'kanban' | 'crm' | 'calendar' | 'projects' | 'timetrack' | 'document'

const ShadProvider = () => {
	const [activeView, setActiveView] = useState<View>('kanban')
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

	// const navItems = [
	// 	{ id: 'kanban', label: 'Kanban Board', icon: LayoutGrid },
	// 	{ id: 'crm', label: 'CRM', icon: Users }
	// ]
	return (
		<SidebarProvider>
			{/*@ts-ignore */}
			<AppSidebar setActiveView={setActiveView} activeView={activeView} />
			<SidebarInset>
				<header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>Data Fetching</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</header>

				<div className="flex flex-1 flex-col gap-4 p-4">
					{/* 
					{Array.from({ length: 24 }).map((_, index) => (
						<div key={index} className="aspect-video h-12 w-full rounded-lg bg-muted/50" />
					))}
					*/}
					{/* {children} */}
					<main className="flex-1 overflow-hidden">
						{activeView === 'kanban' && <KanbanBoard />}
						{activeView === 'crm' && <CrmBoard />}
						{activeView === 'projects' && <ProjectBoard />}
						{activeView === 'calendar' && <CalendarBoard />}
						{activeView === 'timetrack' && <TimetrackBoard />}
						{activeView === 'document' && <DocumentBoard />}
					</main>
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}

export default ShadProvider
