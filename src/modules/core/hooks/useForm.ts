import { useState, type ChangeEvent, type ChangeEventHandler } from 'react'

type inputChange =
	| (ChangeEvent<HTMLInputElement, HTMLInputElement> & ChangeEventHandler<HTMLTextAreaElement, HTMLTextAreaElement>)
	| { target: { name: string; value: any } }
export const useForm = (initialState = {}) => {
	const [formState, setFormState] = useState(initialState)

	const onInputChange = ({ target }: inputChange) => {
		const { name, value } = target

		setFormState({
			...formState,
			[name]: value
		})
	}
	const onResetForm = () => {
		setFormState(initialState)
	}

	return {
		formState,
		setFormState,
		onInputChange,
		onResetForm
	}
}
