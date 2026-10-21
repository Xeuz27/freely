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
					className="[&_#search]:focus-visible:ring-accent! border-muted-foreground/50 relative flex h-6 cursor-pointer items-center border-b"
				>
					<Label htmlFor="search" className="sr-only">
						Search
					</Label>
					<SidebarInput
						id="search"
						autoComplete="off"
						placeholder="Search the docs..."
						className={cn('border-0 bg-transparent! px-0 focus-visible:ring-0', open ? 'px-2' : 'w-0 px-0')}
					/>
					<SearchIcon
						className={cn(
							'pointer-events-none opacity-50 select-none',
							open ? 'mx-auto mr-2 size-6' : 'mx-auto size-5'
						)}
					/>
				</SidebarGroupContent>
			</SidebarGroup>
		</form>
	)
}
