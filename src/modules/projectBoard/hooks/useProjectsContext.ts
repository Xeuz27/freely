import { useContext } from 'react'
import { ProjectsContext } from '../context/ProjectsContext'

const useProjectsContext = () => {
	const context = useContext(ProjectsContext)
	if (!context) {
		throw new Error('useProjectContext must be used within ProjectContextProvider')
	}
	return context
}

export default useProjectsContext
