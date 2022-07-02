import { FormStore } from './useForm'
import type { FieldContextType } from './form.d'
import { createContext } from 'react'

export const FieldContext = createContext<FieldContextType>(new FormStore())
