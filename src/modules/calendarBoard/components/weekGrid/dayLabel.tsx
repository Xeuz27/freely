import { cn } from '@/lib/utils'
import useCalendarContext from '../../hooks/useCalendarContext'
import { isToday } from '../../utils/isToday'

export const DayLabel = ({ day }: { day: Date }) => {
	const { setCurrentDate, setView } = useCalendarContext()
	return (
		<div key={day.toISOString()} className={cn('py-2 text-center', isToday(day) && 'bg-primary/10 rounded-t-lg')}>
			<p className="text-xs text-muted-foreground">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.getDay()]}</p>
			<button
				onClick={() => {
					setCurrentDate(day)
					setView('day')
				}}
				className={cn('text-lg font-semibold hover:underline', isToday(day) ? 'text-primary' : 'text-foreground')}
			>
				{day.getDate()}
			</button>
		</div>
	)
}
