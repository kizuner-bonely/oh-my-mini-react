import type { FormProps } from './form.d'
import type { FormEvent } from 'react'
import { useEffect, useCallback } from 'react'

import useForm from './useForm'
import Field from './ComponentField'
import { FieldContext } from './FieldContext'

export default function Form(props: FormProps) {
  const { children, form, onFinish, onFinishFailed } = props

  useEffect(() => {
    form.setCallbacks({ onFinish, onFinishFailed })
  }, [form, onFinish, onFinishFailed])

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      form.submit()
    },
    [form],
  )

  return (
    <form onSubmit={handleSubmit}>
      <FieldContext.Provider value={form}>{children}</FieldContext.Provider>
    </form>
  )
}

Form.Field = Field
Form.useForm = useForm
