import { createContext, type ReactNode, type Dispatch, type SetStateAction } from 'react'
import { useProjects } from '../hooks/useProjects'
import type { Lead, SortOrder } from 'src/types/crm-types'
import type { Project, ProjectStatus, ProjectPriority, SortField } from 'src/types/project-types'

type ProjectsContext = {
	projects: Project[]
	setProjects: Dispatch<SetStateAction<Project[]>>
	leads: Lead[]
	setLeads: Dispatch<SetStateAction<Lead[]>>
	searchQuery: string
	setSearchQuery: Dispatch<SetStateAction<string>>
	statusFilter: ProjectStatus | 'all'
	setStatusFilter: Dispatch<SetStateAction<ProjectStatus | 'all'>>
	priorityFilter: 'all' | ProjectPriority
	setPriorityFilter: Dispatch<SetStateAction<'all' | ProjectPriority>>
	sheetOpen: boolean
	setSheetOpen: Dispatch<SetStateAction<boolean>>
	editingProject: Project | null
	setEditingProject: Dispatch<SetStateAction<Project | null>>
	sortField: SortField
	setSortField: Dispatch<SetStateAction<SortField>>
	sortOrder: SortOrder
	setSortOrder: Dispatch<SetStateAction<SortOrder>>
}

type props = {
	children: ReactNode
}

export const ProjectsContext = createContext<ProjectsContext | null>(null)

const ProjectsContextProvider = ({ children }: props) => {
	const values = useProjects()

	return <ProjectsContext.Provider value={values}>{children}</ProjectsContext.Provider>
}

export default ProjectsContextProvider
