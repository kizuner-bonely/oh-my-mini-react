import type { FormConsumerProps } from './formily-react.type'
import { useContext } from 'react'
import { observer } from '@myFormily'
import { FormContext } from './FormContext'

export const FormConsumer = observer((props: FormConsumerProps) => {
  const form = useContext(FormContext)
  return props.children(form)
})
