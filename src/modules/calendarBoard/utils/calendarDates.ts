export const getWeekDays = (currentDate: Date): Date[] => {
	const startOfWeek = new Date(currentDate)
	const day = startOfWeek.getDay()
	startOfWeek.setDate(startOfWeek.getDate() - day)

	const weekDays: Date[] = []
	for (let i = 0; i < 7; i++) {
		weekDays.push(new Date(startOfWeek))
		startOfWeek.setDate(startOfWeek.getDate() + 1)
	}
	return weekDays
}

export const getMonthDays = (year: number, month: number): (Date | null)[] => {
	const daysInMonth = new Date(year, month + 1, 0).getDate()
	const firstDayOfMonth = new Date(year, month, 1).getDay()
	
	const days: (Date | null)[] = []
	for (let i = 0; i < firstDayOfMonth; i++) {
		days.push(null)
	}
	for (let i = 1; i <= daysInMonth; i++) {
		days.push(new Date(year, month, i))
	}
	return days
}
