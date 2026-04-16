import { useEffect } from 'react'
import { useLocalStorage } from './useStorage'

// usePersist('shoppingCartState', $shoppingCartState, setStateFromLocalStorage)

const usePersist = <T>(key: string, state: T, setState: (value: T) => void) => {
	const [values, setValue, remove] = useLocalStorage(key, state)
	//  on page reload, updates state with localstorage if it exists
	useEffect(() => {
		if (values == null) return
		//@ts-ignore
		// eslint-disable-next-line react-hooks/exhaustive-deps
		setState(values)
	}, [])

	// on state changes, update the stage in localstorage
	useEffect(() => {
		setValue(state)
	}, [state, setValue])

	// on state removal, removes the state in local storage
	useEffect(() => {
		if (state == null) {
			remove()
		}
	}, [state, remove])
}

export default usePersist
