import type { ChangeEvent } from 'react'
import type { FieldConstructorProps } from './core.type'
import { Form } from './Form'

export class Field {
  public component: JSX.Element
  public decorator: any[]
  public selfErrors: string[]
  public value: any

  constructor(
    private name: string,
    private props: FieldConstructorProps,
    private form: Form,
  ) {
    this.form.fields.set(name, this)

    const { component, decorator } = props

    this.component = component
    this.decorator = decorator
    this.selfErrors = []

    this.value = this.form.values.get(name)
  }

  onInput(e: ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value
  }
}
