import type { FormConstructorProps, FieldConstructorProps } from './core.type'
import { Field } from './Field'
// import { define } from './define'
import { observable, define } from '@myFormily'

export class Form {
  public fields: Map<string, Field>
  public values: Map<string, any>
  public initialValues: Record<string, any>
  public props: FormConstructorProps

  constructor(props: FormConstructorProps) {
    this.props = { ...props }
    this.fields = new Map()
    this.values = new Map()

    const { initialValues = {} } = props ?? {}
    this.initialValues = { ...initialValues }

    this.makeObservable()
  }

  makeObservable() {
    define(this, {
      fields: observable.shallow,
      values: observable,
    })
  }

  createField(props: FieldConstructorProps) {
    const { name } = props

    if (!this.fields.has(name)) {
      new Field(name, props, this)
    }
  }

  onMount() {}
  onUnmount() {}
}
