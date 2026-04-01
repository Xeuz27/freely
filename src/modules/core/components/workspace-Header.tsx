import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

const WorkspaceHeader = ({ children }: any) => {
	return (
		<header className="sticky top-0 shrink-0 border-b h-16 flex gap-4 items-center justify-between">
			<div className="flex items-center ">
				<SidebarTrigger className="size-8 p-1" />
				<Separator orientation="vertical" className="ml-3.5 h-8" />
			</div>
			<div className="flex flex-1 justify-between">{children}</div>
		</header>
	)
}

export { WorkspaceHeader }
