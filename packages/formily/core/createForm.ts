import type { FormConstructorProps } from './core.type'
import { Form } from './Form'

export function createForm(options: FormConstructorProps) {
  return new Form(options)
}
