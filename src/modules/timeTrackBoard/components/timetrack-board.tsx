'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { type KanbanCard, cardTypeColors } from '@/types/kanban-types'
import { type Project, projectStatusConfig } from '@/types/project-types'
import { type TimeEntry, calculateDuration, formatDuration, formatTimeRange } from '@/types/timetrack-types'
import { Calendar, ChevronLeft, ChevronRight, Clock, FolderKanban, LayoutGrid, MoreHorizontal, Pencil, Plus, Tag, Timer, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { TimeEntryDialog } from './time-entry-dialog'

export const sampleProjects: Project[] = [
	{
		id: 'proj-1',
		name: 'Website Redesign',
		status: 'in_progress',
		priority: 'high',
		startDate: new Date(),
		deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: 'proj-2',
		name: 'Mobile App MVP',
		status: 'planning',
		priority: 'urgent',
		startDate: new Date(),
		deliveryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
		createdAt: new Date(),
		updatedAt: new Date()
	}
]

export const sampleKanbanCards: KanbanCard[] = [
	{ id: 'card-1', title: 'Design homepage mockup', type: 'task', createdAt: new Date() },
	{ id: 'card-2', title: 'API integration research', type: 'idea', createdAt: new Date() },
	{ id: 'card-3', title: 'User feedback analysis', type: 'data', createdAt: new Date() }
]

const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)

const initialEntries: TimeEntry[] = [
	{
		id: '1',
		title: 'Team standup meeting',
		description: 'Daily sync with the development team',
		date: today,
		startTime: '09:00',
		endTime: '09:30',
		projectId: 'proj-1',
		tags: ['meeting', 'team'],
		createdAt: new Date()
	},
	{
		id: '2',
		title: 'Homepage design work',
		description: 'Working on the hero section and navigation',
		date: today,
		startTime: '09:45',
		endTime: '12:00',
		projectId: 'proj-1',
		kanbanCardId: 'card-1',
		tags: ['design', 'deep work'],
		createdAt: new Date()
	},
	{
		id: '3',
		title: 'Lunch break',
		date: today,
		startTime: '12:00',
		endTime: '13:00',
		tags: ['break'],
		createdAt: new Date()
	},
	{
		id: '4',
		title: 'Client call',
		description: 'Discussing project requirements and timeline',
		date: today,
		startTime: '14:00',
		endTime: '15:00',
		projectId: 'proj-2',
		tags: ['meeting', 'client', 'billable'],
		createdAt: new Date()
	},
	{
		id: '5',
		title: 'Code review and documentation',
		date: yesterday,
		startTime: '10:00',
		endTime: '11:30',
		projectId: 'proj-1',
		tags: ['review', 'docs'],
		createdAt: new Date()
	}
]

export function TimetrackBoard() {
	const [entries, setEntries] = useState<TimeEntry[]>(initialEntries)
	const [currentDate, setCurrentDate] = useState(new Date())
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editEntry, setEditEntry] = useState<TimeEntry | null>(null)
	const [initialStartTime, setInitialStartTime] = useState<string | undefined>()
	const [initialEndTime, setInitialEndTime] = useState<string | undefined>()
	const [viewMode, setViewMode] = useState<'day' | 'week'>('day')

	const projects = sampleProjects
	const kanbanCards = sampleKanbanCards

	const isSameDay = (d1: Date, d2: Date) =>
		d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()

	const isToday = (date: Date) => isSameDay(date, new Date())

	const getEntriesForDate = (date: Date) => entries.filter((e) => isSameDay(e.date, date)).sort((a, b) => a.startTime.localeCompare(b.startTime))

	const getWeekDates = useMemo(() => {
		const dates: Date[] = []
		const start = new Date(currentDate)
		start.setDate(start.getDate() - start.getDay())
		for (let i = 0; i < 7; i++) {
			const d = new Date(start)
			d.setDate(start.getDate() + i)
			dates.push(d)
		}
		return dates
	}, [currentDate])

	const todayEntries = getEntriesForDate(currentDate)
	const todayTotalMinutes = todayEntries.reduce((acc, e) => acc + calculateDuration(e.startTime, e.endTime), 0)

	const weekTotalMinutes = useMemo(() => {
		return getWeekDates.reduce((acc, date) => {
			const dayEntries = getEntriesForDate(date)
			return acc + dayEntries.reduce((dayAcc, e) => dayAcc + calculateDuration(e.startTime, e.endTime), 0)
		}, 0)
	}, [getWeekDates, entries])

	const handleAddEntry = (startTime?: string, endTime?: string) => {
		setEditEntry(null)
		setInitialStartTime(startTime)
		setInitialEndTime(endTime)
		setDialogOpen(true)
	}

	const handleEditEntry = (entry: TimeEntry) => {
		setEditEntry(entry)
		setInitialStartTime(undefined)
		setInitialEndTime(undefined)
		setDialogOpen(true)
	}

	const handleDeleteEntry = (id: string) => {
		setEntries((prev) => prev.filter((e) => e.id !== id))
	}

	const handleSaveEntry = (entryData: Omit<TimeEntry, 'id' | 'createdAt'> & { id?: string }) => {
		if (entryData.id) {
			setEntries((prev) => prev.map((e) => (e.id === entryData.id ? { ...entryData, id: e.id, createdAt: e.createdAt } : e)))
		} else {
			const newEntry: TimeEntry = {
				...entryData,
				id: `entry-${Date.now()}`,
				createdAt: new Date()
			}
			setEntries((prev) => [...prev, newEntry])
		}
	}

	const navigateDate = (direction: 'prev' | 'next') => {
		const newDate = new Date(currentDate)
		if (viewMode === 'day') {
			newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
		} else {
			newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
		}
		setCurrentDate(newDate)
	}

	const goToToday = () => {
		setCurrentDate(new Date())
	}

	const formatDateHeader = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		})
	}

	const formatShortDate = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			day: 'numeric'
		})
	}

	const getProjectById = (id?: string) => projects.find((p) => p.id === id)
	const getKanbanCardById = (id?: string) => kanbanCards.find((c) => c.id === id)

	const TimeEntryCard = ({ entry }: { entry: TimeEntry }) => {
		const duration = calculateDuration(entry.startTime, entry.endTime)
		const project = getProjectById(entry.projectId)
		const kanbanCard = getKanbanCardById(entry.kanbanCardId)

		return (
			<div className="group flex gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
				<div className="flex flex-col items-center text-xs text-muted-foreground w-16 shrink-0">
					<span className="font-medium text-foreground">{entry.startTime}</span>
					<div className="h-6 w-px bg-border my-1" />
					<span className="font-medium text-foreground">{entry.endTime}</span>
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between gap-2">
						<div className="flex-1 min-w-0">
							<h4 className="font-medium text-foreground truncate">{entry.title}</h4>
							{entry.description && <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{entry.description}</p>}
						</div>
						<div className="flex items-center gap-2">
							<Badge variant="secondary" className="shrink-0">
								<Timer className="size-3 mr-1" />
								{formatDuration(duration)}
							</Badge>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon" className="size-8 opacity-0 group-hover:opacity-100 transition-opacity">
										<MoreHorizontal className="size-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem onClick={() => handleEditEntry(entry)}>
										<Pencil className="size-4 mr-2" />
										Edit
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handleDeleteEntry(entry.id)} className="text-destructive">
										<Trash2 className="size-4 mr-2" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-2 mt-2">
						{project && (
							<Badge variant="outline" className={cn('text-xs', projectStatusConfig[project.status].color)}>
								<FolderKanban className="size-3 mr-1" />
								{project.name}
							</Badge>
						)}
						{kanbanCard && (
							<Badge
								variant="outline"
								className={cn(
									'text-xs',
									cardTypeColors[kanbanCard.type].bg,
									cardTypeColors[kanbanCard.type].text,
									cardTypeColors[kanbanCard.type].border
								)}
							>
								<LayoutGrid className="size-3 mr-1" />
								{kanbanCard.title}
							</Badge>
						)}
						{entry.tags?.map((tag) => (
							<Badge key={tag} variant="secondary" className="text-xs">
								<Tag className="size-3 mr-1" />
								{tag}
							</Badge>
						))}
					</div>
				</div>
			</div>
		)
	}

	const timeSlots = [
		'06:00',
		'07:00',
		'08:00',
		'09:00',
		'10:00',
		'11:00',
		'12:00',
		'13:00',
		'14:00',
		'15:00',
		'16:00',
		'17:00',
		'18:00',
		'19:00',
		'20:00',
		'21:00'
	]

	return (
		<div className="h-full flex flex-col">
			<header className="flex items-center justify-between px-6 py-4 border-b border-border">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<Clock className="size-5 text-primary" />
						<h1 className="text-xl font-semibold">Time Tracker</h1>
					</div>
					<div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
						<Button variant={viewMode === 'day' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('day')}>
							Day
						</Button>
						<Button variant={viewMode === 'week' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('week')}>
							Week
						</Button>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-lg">
						<Timer className="size-4 text-muted-foreground" />
						<span className="text-sm text-muted-foreground">{viewMode === 'day' ? 'Today:' : 'This week:'}</span>
						<span className="font-semibold text-primary">
							{formatDuration(viewMode === 'day' ? todayTotalMinutes : weekTotalMinutes)}
						</span>
					</div>
					<Button onClick={() => handleAddEntry()}>
						<Plus className="size-4 mr-2" />
						Log Time
					</Button>
				</div>
			</header>

			<div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/50">
				<div className="flex items-center gap-2">
					<Button variant="outline" size="icon" onClick={() => navigateDate('prev')}>
						<ChevronLeft className="size-4" />
					</Button>
					<Button variant="outline" size="icon" onClick={() => navigateDate('next')}>
						<ChevronRight className="size-4" />
					</Button>
					<Button variant="ghost" size="sm" onClick={goToToday}>
						Today
					</Button>
				</div>
				<div className="flex items-center gap-2">
					<Calendar className="size-4 text-muted-foreground" />
					<span className="font-medium">
						{viewMode === 'day'
							? formatDateHeader(currentDate)
							: `${formatShortDate(getWeekDates[0])} - ${formatShortDate(getWeekDates[6])}`}
					</span>
					{isToday(currentDate) && viewMode === 'day' && (
						<Badge variant="secondary" className="ml-2">
							Today
						</Badge>
					)}
				</div>
				<div className="w-32" />
			</div>

			<div className="flex-1 overflow-y-auto">
				{viewMode === 'day' ? (
					<div className="flex h-full">
						<div className="flex-1 p-6">
							<div className="space-y-3">
								{todayEntries.length > 0 ? (
									todayEntries.map((entry) => <TimeEntryCard key={entry.id} entry={entry} />)
								) : (
									<div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
										<Clock className="size-12 mb-4 opacity-50" />
										<p className="text-lg font-medium">No time logged yet</p>
										<p className="text-sm">Start tracking your day</p>
										<Button variant="outline" className="mt-4" onClick={() => handleAddEntry()}>
											<Plus className="size-4 mr-2" />
											Log your first entry
										</Button>
									</div>
								)}
							</div>
						</div>

						<aside className="w-64 border-l border-border p-4 bg-card/30">
							<h3 className="font-medium mb-4 text-sm text-muted-foreground uppercase tracking-wide">Quick Add</h3>
							<div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto">
								{timeSlots.map((time, index) => {
									const nextTime = timeSlots[index + 1]
									const hasEntry = todayEntries.some((e) => (e.startTime <= time && e.endTime > time) || e.startTime === time)
									return (
										<button
											key={time}
											onClick={() => nextTime && handleAddEntry(time, nextTime)}
											disabled={!nextTime}
											className={cn(
												'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left',
												hasEntry
													? 'bg-primary/10 text-primary border border-primary/20'
													: 'hover:bg-secondary text-muted-foreground hover:text-foreground'
											)}
										>
											<span className="font-mono text-xs w-12">{time}</span>
											{hasEntry ? (
												<span className="text-xs">Logged</span>
											) : (
												<Plus className="size-3 opacity-0 group-hover:opacity-100" />
											)}
										</button>
									)
								})}
							</div>
						</aside>
					</div>
				) : (
					<div className="p-6">
						<div className="grid grid-cols-7 gap-4">
							{getWeekDates.map((date) => {
								const dayEntries = getEntriesForDate(date)
								const dayTotal = dayEntries.reduce((acc, e) => acc + calculateDuration(e.startTime, e.endTime), 0)
								return (
									<div
										key={date.toISOString()}
										className={cn(
											'rounded-lg border border-border overflow-hidden',
											isToday(date) && 'border-primary/50 ring-1 ring-primary/20'
										)}
									>
										<div className={cn('px-3 py-2 border-b border-border', isToday(date) ? 'bg-primary/10' : 'bg-card')}>
											<div className="flex items-center justify-between">
												<span className={cn('text-sm font-medium', isToday(date) && 'text-primary')}>
													{formatShortDate(date)}
												</span>
												<button
													onClick={() => {
														setCurrentDate(date)
														handleAddEntry()
													}}
													className="size-5 flex items-center justify-center rounded hover:bg-secondary"
												>
													<Plus className="size-3" />
												</button>
											</div>
											{dayTotal > 0 && <div className="text-xs text-muted-foreground mt-1">{formatDuration(dayTotal)}</div>}
										</div>
										<div className="p-2 space-y-1 min-h-[150px] max-h-[300px] overflow-y-auto bg-background">
											{dayEntries.map((entry) => {
												const project = getProjectById(entry.projectId)
												return (
													<button
														key={entry.id}
														onClick={() => handleEditEntry(entry)}
														className={cn(
															'w-full text-left px-2 py-1.5 rounded text-xs transition-colors',
															project ? projectStatusConfig[project.status].color : 'bg-secondary hover:bg-secondary/80'
														)}
													>
														<div className="font-medium truncate">{entry.title}</div>
														<div className="text-muted-foreground">{formatTimeRange(entry.startTime, entry.endTime)}</div>
													</button>
												)
											})}
											{dayEntries.length === 0 && (
												<div className="flex items-center justify-center h-20 text-xs text-muted-foreground">No entries</div>
											)}
										</div>
									</div>
								)
							})}
						</div>
					</div>
				)}
			</div>

			<TimeEntryDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				onSave={handleSaveEntry}
				editEntry={editEntry}
				initialDate={currentDate}
				initialStartTime={initialStartTime}
				initialEndTime={initialEndTime}
				projects={projects}
				kanbanCards={kanbanCards}
			/>
		</div>
	)
}
