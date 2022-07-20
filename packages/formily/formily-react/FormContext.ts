import type { FormType } from './formily-react.type'
import { createContext } from 'react'

export const FormContext = createContext<FormType>({} as FormType)
