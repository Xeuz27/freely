import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar.tsx'
import { CalendarBoard } from '@/modules/calendarBoard/components/calendar-board.tsx'
import CalendarContextProvider from '@/modules/calendarBoard/context/calendarContext.tsx'
import { AppSidebar } from '@/modules/core/components/sidebar/app-sidebar.tsx'
import CrmContextProvider from '@/modules/crmBoard/context/crmContext.tsx'
import { DocumentBoard } from '@/modules/documentBoard/components/document-board.tsx'
import { ProjectBoard } from '@/modules/projectBoard/components/project-board.tsx'
import { TimetrackBoard } from '@/modules/timeTrackBoard/components/timetrack-board.tsx'
import { useState } from 'react'
import { CrmBoard } from '../modules/crmBoard/components/crm-board.tsx'
import { KanbanBoard } from '../modules/kanbanBoard/components/kanban-board.tsx'

export type View = 'kanban' | 'crm' | 'calendar' | 'projects' | 'timetrack' | 'document'

export function Workspace() {
	const [activeView, setActiveView] = useState<View>('crm')

	return (
		<SidebarProvider>
			<CrmContextProvider>
				<CalendarContextProvider>
					{/*@ts-ignore */}
					<AppSidebar setActiveView={setActiveView} activeView={activeView} />
					<SidebarInset>
						<main className="flex-1 flex overflow-hidden">
							{activeView === 'kanban' && <KanbanBoard />}
							{activeView === 'crm' && <CrmBoard />}
							{activeView === 'projects' && <ProjectBoard />}
							{activeView === 'calendar' && <CalendarBoard />}
							{activeView === 'timetrack' && <TimetrackBoard />}
							{activeView === 'document' && <DocumentBoard />}
						</main>
					</SidebarInset>
				</CalendarContextProvider>
			</CrmContextProvider>
		</SidebarProvider>
	)
}
