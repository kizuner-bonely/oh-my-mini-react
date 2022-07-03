import type { FunctionFieldProps } from './form.d'
import {
  cloneElement,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react'
import { FieldContext } from './FieldContext'

export default function FunctionField(props: FunctionFieldProps) {
  const { name, children } = props
  const { getFieldValue, setFieldValue, registerEntities } =
    useContext(FieldContext)

  const [, forceUpdate] = useReducer(x => x + 1, 0)

  useEffect(() => {
    const unregister = registerEntities({
      props,
      onStoreChanged: forceUpdate,
    } as any)

    return () => {
      unregister()
    }
  }, [])

  const controller = useCallback(() => {
    return {
      value: getFieldValue(name),
      onChange(e: Event) {
        const target = e.target as HTMLInputElement | HTMLButtonElement
        const newValue = target.value
        setFieldValue({ [name]: newValue })
      },
    }
  }, [])

  return cloneElement(children, controller())
}
