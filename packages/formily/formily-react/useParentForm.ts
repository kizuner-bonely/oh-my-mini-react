import { useContext } from 'react'
import { FormContext } from './FormContext'

export function useParentForm() {
  const form = useContext(FormContext)
  return form
}
