const isSameDay = (a: Date, b: Date) => {
	//prettier-ignore
	return  a.getFullYear() === b.getFullYear() &&
			a.getMonth() === b.getMonth() &&
			a.getDate() === b.getDate()
}

const isToday = (date: Date) => isSameDay(date, new Date())

export { isSameDay, isToday }
