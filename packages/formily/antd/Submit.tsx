import type { SubmitProps } from './antd.type'
import { useCallback } from 'react'
import { useParentForm } from '@myFormily'

export function Submit(props: SubmitProps) {
  const { children, onClick, onSubmit, onSubmitFailed, onSubmitSuccess } = props

  const form = useParentForm()

  const handleClick = useCallback(
    (e: any) => {
      if (onClick) {
        if (onClick(e) === false) return
      }
      form.submit(onSubmit).then(onSubmitSuccess).catch(onSubmitFailed)
    },
    [form, onClick, onSubmit, onSubmitSuccess, onSubmitFailed],
  )

  return <button onClick={handleClick}>{children}</button>
}
