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
      event.preventDefault();
      // Stash the event so it can be triggered later.
	  // @ts-ignore
      window.deferredPrompt = event;
      // Remove the 'hidden' class from the install button container.
    });
  }, []);
  async function downloadApp() {
    console.log("button-Install clicked");
	// @ts-ignore	
	console.log("window.deferredPrompt", window.deferredPrompt);
	// @ts-ignore	
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
      // The deferred prompt isn't available.
      console.log("oops, no prompt event guardado en window");
      return;
    }
    // Show the install prompt.
	console.log("promptEvent", promptEvent);
    promptEvent.prompt();
    // Log the result
    const result = await promptEvent.userChoice;
    console.log("userChoice", result);
    // Reset the deferred prompt variable, since
    // prompt() can only be called once.
	// @ts-ignore
    window.deferredPrompt = null;
    // Hide the install button.
  }

	return (
		<SidebarProvider>
			<CalendarContextProvider>
				<CrmContextProvider>
					<AppSidebar setActiveBoard={setActiveBoard} activeBoard={activeBoard} />
					<SidebarInset>
						<main className="flex-1 flex overflow-hidden">
							<button className='install' onClick={() => downloadApp()}>install</button>
							<ActiveBoard />
						</main>
					</SidebarInset>
				</CrmContextProvider>
			</CalendarContextProvider>
		</SidebarProvider>
	)
}
