import { useState } from 'react'
import { sampleLeads } from 'src/data/sampleLeads'
import { sampleProjects } from 'src/data/sampleProjects'
import usePersist from 'src/modules/core/hooks/usePersist'
import type { Lead, SortOrder } from 'src/types/crm-types'
import type { Project, ProjectStatus, ProjectPriority, SortField } from 'src/types/project-types'

const useProjects = () => {
	const [projects, setProjects] = useState<Project[]>(sampleProjects)
	const [leads, setLeads] = useState<Lead[]>(sampleLeads)
	const [searchQuery, setSearchQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
	const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | 'all'>('all')
	const [sheetOpen, setSheetOpen] = useState(false)
	const [editingProject, setEditingProject] = useState<Project | null>(null)
	const [sortField, setSortField] = useState<SortField>('deliveryDate')
	const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

	usePersist('projects', projects, setProjects)

	return {
		projects,
		setProjects,
		leads,
		setLeads,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		priorityFilter,
		setPriorityFilter,
		sheetOpen,
		setSheetOpen,
		editingProject,
		setEditingProject,
		sortField,
		setSortField,
		sortOrder,
		setSortOrder
	}
}

export { useProjects }
