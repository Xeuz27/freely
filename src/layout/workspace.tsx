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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx'
import { MonitorDown } from 'lucide-react'
export type Board = 'kanban' | 'crm' | 'calendar' | 'projects' | 'timetrack' | 'document'

export function Workspace() {
	const [activeBoard, setActiveBoard] = useState<Board>('calendar')
	const [installed, setInstalled] = useState(false)
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
	  console.log(event)
      event.preventDefault();
      // Stash the event so it can be triggered later.
	  // @ts-ignore
      window.deferredPrompt = event;
	  // @ts-ignore
	  console.log(window.deferredPrompt)
      // Remove the 'hidden' class from the install button container.
    });
  }, []);
  useEffect(() => {
	window.addEventListener("appinstalled", (event) => {
		console.log("appinstalled");
		setInstalled(true);
	})
  }, [])
  async function downloadApp() {
    console.log("button-install clicked");
	//	@ts-ignore
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
      // The deferred prompt isn't available.
      console.log("oops, no prompt event guardado en window");
      return;
    }
    // Show the install prompt.
    promptEvent.prompt();
    // Log the result
    const result = await promptEvent.userChoice;
    console.log("👍", "userChoice", result);
    // Reset the deferred prompt variable, since
    // prompt() can only be called once.
	//	@ts-ignore
    window.deferredPrompt = null;
    // Hide the install button.
  }

	return (
		<SidebarProvider>
			<CalendarContextProvider>
				<CrmContextProvider>
					<AppSidebar setActiveBoard={setActiveBoard} activeBoard={activeBoard} />
					<SidebarInset>
						{/* <div className="flex divide-x divide-accent items-center justify-center gap-4 border border-border rounded-md p-4">
								<button className='dialog border-accent px-4 py-2 border rounded-sm ' onClick={() => setInstalled(true)}>dialog</button>

								<button className='install bg-primary flex items-center px-4 gap-2 py-2 border rounded-sm' onClick={downloadApp}>
									<span className="sm:inline tracking-wide">Install</span>
									<span>
										<MonitorDown className="size-5" />
									</span>
									
									</button>
							</div> */}
						<main className="flex-1 flex overflow-hidden">
							{/* <Dialog open={installed} onOpenChange={() => setInstalled(false)}>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>App installed</DialogTitle>
										<DialogDescription>
											The app has been installed successfully.
										</DialogDescription>
									</DialogHeader>
								</DialogContent>
							</Dialog> */}
							
							<ActiveBoard />
						</main>
					</SidebarInset>
				</CrmContextProvider>
			</CalendarContextProvider>
		</SidebarProvider>
	)
}
