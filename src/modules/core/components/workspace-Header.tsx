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
		<header className="sticky top-0 shrink-0 border-b h-16 flex gap-4 items-center justify-between">
			<div className="flex items-center ">
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
			<div className="flex items-center justify-center size-9 rounded-lg bg-primary/30">
				<Icon className="size-5 text-primary" />
			</div>
			<div>
				<h1 className="text-lg font-semibold text-foreground">{title}</h1>
				<p className="text-xs text-muted-foreground hidden md:block">{description}</p>
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
			<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
			<Input className="pl-9 w-48 bg-secondary/50" 
				placeholder={placeholder} 
				value={value} 
				onChange={(e) => onSearch(e.target.value)}
			/>
		</div>
	)
}
const Tabs = ({ children }: TabsProps) => {
	return <div className="flex justify-center items-center gap-1 rounded-lg p-1 bg-border">{children}</div>
}
const Tab = ({ text, isActive, className, onClick }: TabProps) => {
	return (
		<button
			onClick={() => onClick()}
			className={cn(
				'px-3 py-1.5 text-sm rounded-md transition-colors border capitalize',
				isActive === text
					? 'bg-foreground/10 text-foreground shadow-sm border-accent/60'
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
			className="hover:bg-accent/20 px-1.5 md:px-4 gap-0 rounded-full md:rounded-sm"
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

