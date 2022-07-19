import type { CSSProperties, ReactNode } from 'react'

export type FormItemProps = {
  children: ReactNode
}

export type InputProps = {
  value: string
  style?: CSSProperties
}

export type SubmitProps = {
  children: ReactNode
  onClick?: (e: any) => boolean
  onSubmit(res: string): void
  onSubmitSuccess(): void
  onSubmitFailed(err: any): void
}
