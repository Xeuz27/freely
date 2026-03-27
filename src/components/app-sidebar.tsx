import * as React from 'react'

import { SearchForm } from '@/components/search-form'
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar } from '@/components/ui/sidebar'
import { VersionSwitcher } from '@/components/version-switcher'
import { cn } from '@/lib/utils'
import { CalendarDays, Clock, FolderKanban, LayoutGrid, Users } from 'lucide-react'

// This is sample data.
const data = {
	versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
	navMain: [
		{ id: 'kanban', title: 'Kanban Board ', Icon: LayoutGrid },
		{ id: 'crm', title: 'Crm', Icon: Users },
		{ id: 'projects', title: 'Projects', Icon: FolderKanban },
		{ id: 'calendar', title: 'Calendar', Icon: CalendarDays },
		{ id: 'timetrack', title: 'Time Tracker', Icon: Clock }
	]
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { open } = useSidebar()
	/* @ts-ignore */
	const { activeView, setActiveView, sidebarCollapsed, setSidebarCollapsed } = props
	return (
		<Sidebar {...props}>
			<ul className={cn(' flex flex-col flex-1', open ? 'divide-y-1 divide-accent/40' : '')}>
				<SidebarHeader className="px-2 pb-3">
					<VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
					<SearchForm />
				</SidebarHeader>
				<SidebarContent className={cn('py-1 border-transparent', open ? '' : 'px-1.5')}>
					{/* We create a collapsible SidebarGroup for each parent. */}
					{data.navMain.map(({ title, Icon, id }) => (
						<SidebarMenuItem key={title} className="list-none">
							{/* @ts-ignore */}
							<SidebarMenuButton onClick={() => setActiveView(id)}>
								<Icon className={cn('size-5 shrink-0', activeView === id ? 'text-sidebar-primary' : 'text-muted-foreground')} />
								{open && (
									<span className={cn('text-sm tracking-wide', activeView === id ? '' : 'text-muted-foreground')}>{title}</span>
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
