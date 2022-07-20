import type { FormProviderProps } from './formily-react.type'
import { FormContext } from './FormContext'
import { useEffect } from 'react'

export function FormProvider(props: FormProviderProps) {
  const { children, form } = props

  useEffect(() => {
    form.onMount()
    return () => {
      form.onUnmount()
    }
  }, [])

  return <FormContext.Provider value={form}>{children}</FormContext.Provider>
}
