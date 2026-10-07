import * as React from 'react'

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { SearchForm } from '@/modules/core/components/sidebar/search-form'
import { VersionSwitcher } from '@/modules/core/components/sidebar/version-switcher'
import { CalendarDays, Clock, FileText, FolderKanban, LayoutGrid, Users } from 'lucide-react'

// This is sample data.
const data = {
	versions: ['1'],
	navMain: [
		{ id: 'kanban', title: 'Kanban Board ', Icon: LayoutGrid },
		{ id: 'crm', title: 'Crm', Icon: Users },
		{ id: 'projects', title: 'Projects', Icon: FolderKanban },
		{ id: 'calendar', title: 'Calendar', Icon: CalendarDays },
		{ id: 'timetrack', title: 'Time Tracker', Icon: Clock },
		{ id: 'document', title: 'Documents', Icon: FileText }
	] as const
} 
// {
// 	title: 'Build Your Application',
// 	url: '#',
// 	items: [
// 		{
// 			title: 'Routing',
// 			url: '#'
// 		},
// 		{
// 			title: 'Data Fetching',
// 			url: '#',
// 			isActive: true
// 		},
// 		{
// 			title: 'Rendering',
// 			url: '#'
// 		},
// 		{
// 			title: 'Caching',
// 			url: '#'
// 		},
// 		{
// 			title: 'Styling',
// 			url: '#'
// 		},
// 		{
// 			title: 'Optimizing',
// 			url: '#'
// 		},
// 		{
// 			title: 'Configuring',
// 			url: '#'
// 		},
// 		{
// 			title: 'Testing',
// 			url: '#'
// 		},
// 		{
// 			title: 'Authentication',
// 			url: '#'
// 		},
// 		{
// 			title: 'Deploying',
// 			url: '#'
// 		},
// 		{
// 			title: 'Upgrading',
// 			url: '#'
// 		},
// 		{
// 			title: 'Examples',
// 			url: '#'
// 		}
// 	]
// },
// {
// 	title: 'API Reference',
// 	url: '#',
// 	items: [
// 		{
// 			title: 'Components',
// 			url: '#'
// 		},
// 		{
// 			title: 'File Conventions',
// 			url: '#'
// 		},
// 		{
// 			title: 'Functions',
// 			url: '#'
// 		},
// 		{
// 			title: 'next.config.js Options',
// 			url: '#'
// 		},
// 		{
// 			title: 'CLI',
// 			url: '#'
// 		},
// 		{
// 			title: 'Edge Runtime',
// 			url: '#'
// 		}
// 	]
// },
// {
// 	title: 'Architecture',
// 	url: '#',
// 	items: [
// 		{
// 			title: 'Accessibility',
// 			url: '#'
// 		},
// 		{
// 			title: 'Fast Refresh',
// 			url: '#'
// 		},
// 		{
// 			title: 'Next.js Compiler',
// 			url: '#'
// 		},
// 		{
// 			title: 'Supported Browsers',
// 			url: '#'
// 		},
// 		{
// 			title: 'Turbopack',
// 			url: '#'
// 		}
// 	]
// },
// {
// 	title: 'Community',
// 	url: '#',
// 	items: [
// 		{
// 			title: 'Contribution Guide',
// 			url: '#'
// 		}
// 	]
// }
// 	]
// }

type boardId = (typeof data.navMain)[number]['id']
type appSidebarProps = React.ComponentProps<typeof Sidebar> & {
	activeBoard: boardId
	setActiveBoard: (board: boardId) => void
}

export function AppSidebar({ activeBoard, setActiveBoard,...props }: appSidebarProps) {
	const { open, isMobile, openMobile } = useSidebar()
    const isOpen = isMobile ? openMobile : open
	
	return (
		<Sidebar {...props}>
			<ul className={cn(' flex flex-col flex-1', open ? 'divide-y divide-accent/40' : '')}>
				<SidebarHeader className="px-2 pb-3">
					<VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
					<SearchForm />
				</SidebarHeader>
				<SidebarContent className={cn('py-1 border-transparent', open ? '' : 'px-1.5')}>
					{/* We create a collapsible SidebarGroup for each parent. */}
					{data.navMain.map(({ title, Icon, id }) => (
						<SidebarMenuItem key={title} className="list-none">
							{/* @ts-ignore */}
							<SidebarMenuButton onClick={() => setActiveBoard(id)}>
								<Icon className={cn('size-5 shrink-0', activeBoard === id ? 'text-sidebar-primary' : 'text-muted-foreground')} />
								{isOpen && (
									<span className={cn('text-sm tracking-wide', activeBoard === id ? '' : 'text-muted-foreground')}>{title}</span>
								)}
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarContent>
				<SidebarRail />
			</ul>
		</Sidebar>
	)
}
