import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { Plus, Search, type LucideIcon } from 'lucide-react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'

interface WorkspaceHeaderComponent extends React.FC<WorkspaceHeaderprops> {
	Content: typeof Content
	Actions: typeof Actions
	Search: typeof SearchBar
	Button: typeof Btn
	Tabs: typeof Tabs
	Tab: typeof Tab
}
interface WorkspaceHeaderprops {
	children: ReactNode
}

interface ContentProps {
	title: string
	description: string
	Icon: LucideIcon
	children?: ReactNode
}
interface ActionProps {
	children: ReactNode
}
interface SearchBarProps {
	placeholder: string
	value: string
	onSearch: Dispatch<SetStateAction<string>>
}
interface TabsProps {
	className?: string
	children: ReactNode
}
interface TabProps {
	text: string
	isActive: string
	className?: string
	onClick: () => void
}
interface BtnProps {
	text: string
	onClick: () => void
}

const WorkspaceHeader: WorkspaceHeaderComponent = ({ children }: WorkspaceHeaderprops) => {
	return (
		<header className="sticky top-0 flex h-16 shrink-0 items-center justify-between gap-4 border-b">
			<div className="flex items-center">
				<SidebarTrigger className="size-8 p-1" />
				<Separator orientation="vertical" className="ml-3.5 h-8" />
			</div>
			<div className="flex flex-1 justify-between">{children}</div>
		</header>
	)
}

const Content = ({ title, description, Icon, children }: ContentProps) => {
	return (
		<div className="flex items-center gap-3">
			<div className="bg-primary/30 flex size-9 items-center justify-center rounded-lg">
				<Icon className="text-primary size-5" />
			</div>
			<div>
				<h1 className="text-foreground text-lg font-semibold">{title}</h1>
				<p className="text-muted-foreground hidden text-xs sm:block">{description}</p>
			</div>
			{children && <div className="">{children}</div>}
		</div>
	)
}

const Actions = ({ children }: ActionProps) => {
	return <div className="flex items-center gap-3">{children}</div>
}

const SearchBar = ({ placeholder, value, onSearch }: SearchBarProps) => {
	return (
		<div className="relative">
			<Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
			<Input
				className="bg-secondary/50 w-48 pl-9"
				placeholder={placeholder}
				value={value}
				onChange={(e) => onSearch(e.target.value)}
			/>
		</div>
	)
}
const Tabs = ({ className = '', children }: TabsProps) => {
	return (
		<div className={cn('bg-border flex items-center justify-center gap-1 rounded-lg p-1', className)}>
			{children}
		</div>
	)
}
const Tab = ({ text, isActive, className, onClick }: TabProps) => {
	return (
		<button
			onClick={() => onClick()}
			className={cn(
				'rounded-md border px-3 py-1.5 text-sm capitalize transition-colors',
				isActive === text
					? 'bg-foreground/10 text-foreground border-accent/60 shadow-sm'
					: 'text-muted-foreground hover:text-foreground border-transparent',
				className
			)}
		>
			{text}
		</button>
	)
}
const Btn = ({ text, onClick }: BtnProps) => {
	return (
		<Button
			className="hover:bg-accent/20 gap-0 rounded-full px-1.5 md:rounded-sm md:px-4"
			onClick={() => {
				onClick()
			}}
		>
			<Plus className="size-5" />
			<span className="hidden md:block">{text}</span>
		</Button>
	)
}

WorkspaceHeader.Content = Content
WorkspaceHeader.Actions = Actions
WorkspaceHeader.Search = SearchBar
WorkspaceHeader.Button = Btn
WorkspaceHeader.Tabs = Tabs
WorkspaceHeader.Tab = Tab
export { WorkspaceHeader }
