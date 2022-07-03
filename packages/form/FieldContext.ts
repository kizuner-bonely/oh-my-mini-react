import type { FieldContextType } from './form.d'
import { FormStore } from './useForm'
import { createContext } from 'react'

export const FieldContext = createContext<FieldContextType>(
  new FormStore().getForm(),
)
