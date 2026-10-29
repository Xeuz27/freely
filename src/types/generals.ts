export type SortField = 'name' | 'status' | 'priority' | 'deliveryDate' | 'startDate'
export type SortOrder = 'asc' | 'desc'

export type formify<Type> = {
	[Key in keyof Type]: Type[Key] extends Date | undefined
		? string | undefined
		: Type[Key] extends string[] | undefined
			? string
			: Type[Key]
}
