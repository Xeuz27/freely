import type { Lead } from '@/types/crm-types'

type data = Lead[]
export const sortData = (
	Data: data,
	ascOrDesc: 'asc' | 'desc',
	propToSort = 'name'
) => {
	let sorted = [...Data]
	sorted.sort((a, b) => {
		let comparison
		switch (propToSort) {
			case 'name':
				comparison = a.name.localeCompare(b.name)
				break
			case 'company':
				comparison = a.name.localeCompare(b.name)
				break
			case 'status':
				comparison = a.status.localeCompare(b.status)
				break
			case 'createdAt':
				comparison = a.createdAt.getTime() - b.createdAt.getTime()
				break
			case 'updatedAt':
				comparison = a.updatedAt.getTime() - b.updatedAt.getTime()
				break
			default:
				throw new Error(`unkown prop to sort: ${propToSort}`)
		}
		return ascOrDesc === 'asc' ? comparison : -comparison
	})
	return sorted
}
