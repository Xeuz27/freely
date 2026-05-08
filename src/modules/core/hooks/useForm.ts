import type { formify } from '@/types/calendar-types';
import { format } from '@formkit/tempo';
import type { Dispatch, SetStateAction } from 'react';
import { useState, type ChangeEvent, type ChangeEventHandler } from 'react';

type inputChange =
	| (ChangeEvent<HTMLInputElement, HTMLInputElement> & ChangeEventHandler<HTMLTextAreaElement, HTMLTextAreaElement>)
	| { target: { name: string; value: any } }
export const useForm = <Form extends Object>(initialState: Form ) => {
	const [formState, setFormState] = useState<Form>(initialState)

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
	const set = <Key extends keyof Form>(key: Key, value: Form[Key]) => {
		return setFormState((p)=>({
			...p,
			[key]: value
		}))
	}
	return {
		formState,
		set,
		setFormState,
		onInputChange,
		onResetForm
	}
}
const isDate = (value: unknown): value is Date => {
	return value instanceof Date
}

export const updateForm = <Key extends keyof Type, Type>(
	prop: Key,
	editing: Type,
	set: Dispatch<SetStateAction<formify<Type>>>
) => {
	const value = editing[prop]
	set((prev) => ({
		...prev,
		[prop]: isDate(value) ? format(value, 'YYYY-MM-DD') : value
	}))
}
