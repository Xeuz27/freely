'use client'

import { Label } from '@/components/ui/label'
import { SidebarGroup, SidebarGroupContent, SidebarInput, useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { SearchIcon } from 'lucide-react'

export function SearchForm({ ...props }: React.ComponentProps<'form'>) {
	const { open, toggleSidebar } = useSidebar()
	return (
		<form {...props}>
			<SidebarGroup className="p-0">
				<SidebarGroupContent
					onClick={(e) => {
						const input = document.getElementById('search')
						if (!open) {
							e.preventDefault()
							e.stopPropagation()
							toggleSidebar()
							input?.focus()
						} else {
							input?.focus()
						}
					}}
					className="relative cursor-pointer [&_#search]:focus-visible:ring-accent! h-6 flex border-b border-muted-foreground/50 items-center"
				>
					<Label htmlFor="search" className="sr-only">
						Search
					</Label>
					<SidebarInput
						id="search"
						autoComplete="off"
						placeholder="Search the docs..."
						className={cn('px-0 border-0 bg-transparent! focus-visible:ring-0', open ? 'px-2' : 'px-0 w-0')}
					/>
					<SearchIcon className={cn('pointer-events-none opacity-50 select-none', open ? 'size-6 mx-auto mr-2' : 'size-5 mx-auto')} />
				</SidebarGroupContent>
			</SidebarGroup>
		</form>
	)
}
