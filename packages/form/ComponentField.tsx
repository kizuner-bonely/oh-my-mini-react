import type { ReactElement, JSXElementConstructor } from 'react'
import type { Entity } from './form.d'
import { cloneElement, Component } from 'react'
import { FieldContext } from './FieldContext'

interface FieldProps {
  name: string
  rules: any[] // todo 校验规则
  children: ReactElement<any, string | JSXElementConstructor<any>>
}

export default class Field extends Component<FieldProps, any> {
  static contextType = FieldContext
  declare context: React.ContextType<typeof FieldContext>
  private unregisterEntity: () => void = () => {
    console.log('unregister')
  }

  componentDidMount() {
    const { registerEntities } = this.context
    this.unregisterEntity = registerEntities(this as any as Entity)
  }

  componentWillUnmount() {
    this.unregisterEntity()
  }

  onStoreChanged = () => {
    this.forceUpdate()
  }

  getControlled = () => {
    const { getFieldValue, setFieldValue } = this.context
    const { name } = this.props

    return {
      value: getFieldValue(name),

      onChange(e: Event) {
        const target = e.target as HTMLInputElement | HTMLButtonElement
        const newValue = target.value
        setFieldValue({ [name]: newValue })
      },
    }
  }

  render() {
    const { children } = this.props
    return cloneElement(children, this.getControlled())
  }
}
