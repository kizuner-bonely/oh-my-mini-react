import type { ReactElement } from 'react'
import { FormStore } from './useForm'

export type FieldContextType = ReturnType<FormStore['getForm']>

export type FormCallbacks = {
  onFinish(val: Record<string, any>): void
  onFinishFailed(err: any[], val: Record<string, any>): void
}

export type FormProps = {
  children: JSX.Element | JSX.Element[]
  form?: ReturnType<FormStore['getForm']>
  ref?: RefObject<unknown>
} & FormCallbacks

export type Entity = ReactElement & { onStoreChanged(): void }

export type RuleType = { required?: boolean; message: string }

export type FunctionFieldProps = {
  children: ReactElement<any, string | JSXElementConstructor<any>>
  name: string
}
