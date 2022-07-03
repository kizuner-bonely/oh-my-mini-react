import type { Entity, FormCallbacks } from './form.d'
import { useRef } from 'react'

export default function useForm() {
  const store = useRef(new FormStore()).current

  return [store]
}

export class FormStore {
  private store: Record<string, any> = {} // name: value
  private fieldEntities: Set<Entity> = new Set()
  private callbacks: FormCallbacks = {} as any

  validate = () => {
    const err: Array<{ [K in string]: { message: string } }> = []

    this.fieldEntities.forEach(entity => {
      const { name, rules } = entity.props
      const rule = rules[0]

      if (rule?.required && isFalsy(this.getFieldValue(name))) {
        err.push({ [name]: { message: rule?.message ?? '' } })
      }

      return err
    })

    return err
  }

  submit = () => {
    const { onFinish, onFinishFailed } = this.callbacks
    const err = this.validate()
    if (err.length === 0) {
      // 校验通过
      onFinish(this.getFieldsValue())
    } else {
      // 校验失败
      onFinishFailed(err, this.getFieldsValue())
    }
  }

  registerEntities = (entity: Entity) => {
    this.fieldEntities.add(entity)

    return () => {
      this.fieldEntities.delete(entity)
      delete this.store[entity.props.name]
    }
  }

  setCallbacks = (cb: Partial<FormCallbacks>) => {
    this.callbacks = { ...this.callbacks, ...cb }
  }

  // get
  getFieldsValue = () => {
    return { ...this.store }
  }

  getFieldValue = (name: string) => {
    return this.store[name]
  }

  // set
  setFieldValue = (newStore: Record<string, any>) => {
    // 1. 更新状态到状态仓库
    this.store = { ...this.store, ...newStore }
    // 2. 更新组件
    this.fieldEntities.forEach(entity => {
      if (Object.keys(newStore).includes(entity.props.name)) {
        entity.onStoreChanged()
      }
    })
  }

  getForm = () => {
    return {
      getFieldsValue: this.getFieldsValue,
      getFieldValue: this.getFieldValue,
      setFieldValue: this.setFieldValue,
      registerEntities: this.registerEntities,
      setCallbacks: this.setCallbacks,
      submit: this.submit,
    }
  }
}

function isFalsy(val: unknown) {
  return val === undefined || val === null || val === '' || val === false
}
