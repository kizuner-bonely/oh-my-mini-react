import type { FieldProps } from './formily-react.type'
import { createElement, useContext } from 'react'
import { FormContext } from './FormContext'
import { observer, FieldContext } from '@myFormily'

function PreField(props: FieldProps) {
  const form = useContext(FormContext)
  const field = form.createField(props)

  const renderComponent = createElement((field.component as any)[0], {
    ...(field.component as any)[1],
    value: field.value,
    onChange: field.onInput,
  })

  const decorator = createElement(
    (field.decorator as any)[0],
    (field.decorator as any)[1],
    renderComponent,
  )

  return (
    <FieldContext.Provider value={field}>{decorator}</FieldContext.Provider>
  )
}

export const Field = observer(PreField)
