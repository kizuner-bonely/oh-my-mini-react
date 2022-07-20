import type { MemoExoticComponent, ReactElement, ReactNode } from 'react'
import type { IFieldFactoryProps } from '@formily/core'
import { createForm } from '@formily/core'

export type FormType = ReturnType<typeof createForm>

export type FormProviderProps = {
  form: FormType
  children: ReactNode
}

export type FieldProps = {
  name: string
  title: string
  required: boolean
  decorator: [MemoExoticComponent<any>]
  component: [any, { placeholder?: string }]
} & IFieldFactoryProps<unknown, unknown, any, any>

export type FormConsumerProps = {
  children: (form: FormType) => ReactElement | null
}
