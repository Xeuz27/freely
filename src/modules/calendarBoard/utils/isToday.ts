export const isToday = (today: Date) => {
	const date = new Date()
	return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
}
