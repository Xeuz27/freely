import { useContext } from 'react'
import { CrmContext } from '../context/crmContext'

const useCrmContext = () => {
	const context = useContext(CrmContext)
	if (!context) {
		throw new Error('useCrmContext must be used within crmContextProvider')
	}
	return context
}

export default useCrmContext
