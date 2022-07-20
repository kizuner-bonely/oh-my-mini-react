import type { GeneralField } from '@formily/core'
import { createContext } from 'react'

export const FieldContext = createContext<GeneralField>({} as GeneralField)
