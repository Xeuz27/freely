import type { Project, ProjectStatus, SortField } from 'src/types/project-types'
import useProjectsContext from './useProjectsContext'

const useHandlers = () => {
	const {
		setProjects,
		setEditingProject,
		setSheetOpen,
		setSortOrder,
		sortOrder,
		setSortField,
		sortField,
		projects,
		searchQuery,
		statusFilter,
		priorityFilter
	} = useProjectsContext()

	const handleSaveProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
		if (projectData.id) {
			setProjects((prev) =>
				prev.map((project) =>
					project.id === projectData.id ? { ...project, ...projectData, updatedAt: new Date() } : project
				)
			)
		} else {
			const newProject: Project = {
				...projectData,
				id: crypto.randomUUID().split('-')[0],
				createdAt: new Date(),
				updatedAt: new Date()
			}
			setProjects((prev) => [...prev, newProject])
		}
		setEditingProject(null)
	}

	const handleDeleteProject = (id: string) => {
		setProjects((prev) => prev.filter((project) => project.id !== id))
	}

	const handleEditProject = (project: Project) => {
		setEditingProject(project)
		setSheetOpen(true)
	}

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
		} else {
			setSortField(field)
			setSortOrder('asc')
		}
	}

	const filteredAndSortedProjects = projects
		.filter((project) => {
			const matchesSearch =
				project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				project.ownerId?.toLowerCase().includes(searchQuery.toLowerCase())
			const matchesStatus = statusFilter === 'all' || project.status === statusFilter
			const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter
			return matchesSearch && matchesStatus && matchesPriority
		})
		.sort((a, b) => {
			let comparison = 0
			switch (sortField) {
				case 'name':
					comparison = a.name.localeCompare(b.name)
					break
				case 'status':
					comparison = a.status.localeCompare(b.status)
					break
				case 'priority':
					const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
					comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
					break
				case 'deliveryDate':
					comparison = new Date(a.deliveryDate!).getTime() - new Date(b.deliveryDate!).getTime()
					break
				case 'startDate':
					comparison = new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime()
					break
			}
			return sortOrder === 'asc' ? comparison : -comparison
		})

	const statusCounts = projects.reduce(
		(acc, project) => {
			acc[project.status] = (acc[project.status] || 0) + 1
			return acc
		},
		{} as Record<ProjectStatus, number>
	)

	const activeProjects = projects.filter((p) => p.status !== 'completed' && p.status !== 'cancelled').length

	return {
		handleSaveProject,
		handleDeleteProject,
		handleEditProject,
		handleSort,
		filteredAndSortedProjects,
		statusCounts,
		activeProjects
	}
}
export default useHandlers
