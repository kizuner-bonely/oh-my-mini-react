import type { FormProps } from './form.d'
import type { FormEvent, ForwardedRef } from 'react'
import { forwardRef, useEffect, useCallback, useImperativeHandle } from 'react'

import useForm from './useForm'
import Field from './ComponentField'
import { FieldContext } from './FieldContext'

type FormType = typeof Form & { Field: typeof Field; useForm: typeof useForm }

function Form(props: FormProps, ref?: ForwardedRef<any>) {
  const { children, form, onFinish, onFinishFailed } = props

  const [FormInstance] = useForm(form)

  useImperativeHandle(ref, () => FormInstance)

  useEffect(() => {
    FormInstance.setCallbacks({ onFinish, onFinishFailed })
  }, [FormInstance, onFinish, onFinishFailed])

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      FormInstance.submit()
    },
    [FormInstance],
  )

  return (
    <form onSubmit={handleSubmit}>
      <FieldContext.Provider value={FormInstance}>
        {children}
      </FieldContext.Provider>
    </form>
  )
}

const _Form = forwardRef(Form) as any as FormType

_Form.Field = Field
_Form.useForm = useForm

export default _Form
