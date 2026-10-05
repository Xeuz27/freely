import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar.tsx'
import { CalendarBoard } from '@/modules/calendarBoard/components/calendar-board.tsx'
import CalendarContextProvider from '@/modules/calendarBoard/context/calendarContext.tsx'
import { AppSidebar } from '@/modules/core/components/sidebar/app-sidebar.tsx'
import CrmContextProvider from '@/modules/crmBoard/context/crmContext.tsx'
import { DocumentBoard } from '@/modules/documentBoard/components/document-board.tsx'
import { ProjectBoard } from '@/modules/projectBoard/components/project-board.tsx'
import { TimetrackBoard } from '@/modules/timeTrackBoard/components/timetrack-board.tsx'
import { useEffect, useState } from 'react'
import { CrmBoard } from '../modules/crmBoard/components/crm-board.tsx'
import { KanbanBoard } from '../modules/kanbanBoard/components/kanban-board.tsx'

export type Board = 'kanban' | 'crm' | 'calendar' | 'projects' | 'timetrack' | 'document'

export function Workspace() {
	const [activeBoard, setActiveBoard] = useState<Board>('calendar')
	const [defferredPrompt, setDefferredPrompt] = useState<any>(null);
	const boards = {
		kanban: KanbanBoard,
		crm: CrmBoard,
		calendar: CalendarBoard,
		projects: ProjectBoard,
		timetrack: TimetrackBoard,
		document: DocumentBoard
	}
	const ActiveBoard = boards[activeBoard]

	useEffect(() => {

    	window.addEventListener("beforeinstallprompt", (event) => {
		// Prevent the mini-infobar from appearing on mobile.
			let defferredPrompt = event;
      	console.log(defferredPrompt);
      	// Stash the event so it can be triggered later.
	  	// @ts-ignore
		setDefferredPrompt(defferredPrompt);
      	// Remove the 'hidden' class from the install button container.
    	// setIsReadyForInstall(true);
    	});
		if(defferredPrompt) {
			defferredPrompt.prompt();
		}
  	}, [defferredPrompt, setDefferredPrompt]);

	return (
		<SidebarProvider>
			<CalendarContextProvider>
				<CrmContextProvider>
					<AppSidebar setActiveBoard={setActiveBoard} activeBoard={activeBoard} />
					<SidebarInset>
						<main className="flex-1 flex overflow-hidden">
							<button className='install' onClick={() => defferredPrompt.prompt()}>install</button>
							<ActiveBoard />
						</main>
					</SidebarInset>
				</CrmContextProvider>
			</CalendarContextProvider>
		</SidebarProvider>
	)
}
