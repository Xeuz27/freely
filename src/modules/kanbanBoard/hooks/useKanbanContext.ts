import { useContext } from 'react'
import { KanbanContext } from '../context/kanbanContext'

const useKanbanContext = () => {
	const context = useContext(KanbanContext)
	if (!context) {
		throw new Error('useKanbanContext must be used within KanbanContextProvider')
	}
	return context
}

export default useKanbanContext
