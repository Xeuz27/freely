import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { sortData } from '@/modules/calendarBoard/utils/sortData'
import type { Lead, SortOrder } from '@/types/crm-types'
import { Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LeadRow } from './lead-row'

const LeadTable = ({ data }: { data: Lead[] }) => {
	const [rows, setRows] = useState(data)
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
	const [sortBy, setSortBy] = useState('name')

	useEffect(() => {
		setRows(data)
	}, [data])
	const sortRows = (sortBy: string) => {
		let sorted = sortData(rows, sortOrder, sortBy)
		let order: SortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
		setSortBy(sortBy)
		setSortOrder(order)
		setRows(sorted)
	}

	return (
		<Table>
			<TableHeader>
				<TableRow className="hover:bg-transparent divide-x-2">
					<TableHead
						//@ts-ignore
						sortFn={sortRows}
						sortOrder={sortOrder}
						sortBy={sortBy}
					>
						name
					</TableHead>
					<TableHead
						//@ts-ignore
						sortFn={sortRows}
						sortOrder={sortOrder}
						sortBy={sortBy}
					>
						company
					</TableHead>
					<TableHead>Phone</TableHead>
					<TableHead
						//@ts-ignore
						sortFn={sortRows}
						sortOrder={sortOrder}
						sortBy={sortBy}
					>
						status
					</TableHead>
					<TableHead>Note</TableHead>
					<TableHead>Info</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{rows.length === 0 ? (
					<TableRow>
						<td colSpan={7} className="py-12 text-center">
							<div className="flex flex-col items-center gap-2">
								<Users className="size-8 text-muted-foreground/50" />
								<p className="text-muted-foreground">
									No leads found
								</p>
							</div>
						</td>
					</TableRow>
				) : (
					rows.map((lead) => <LeadRow key={lead.id} lead={lead} />)
				)}
			</TableBody>
		</Table>
	)
}

export default LeadTable
