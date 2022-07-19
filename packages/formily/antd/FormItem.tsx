import type { FormItemProps } from './antd.type'
import { useContext } from 'react'
import { FieldContext, observer } from '@myFormily'
import styles from './index.module.less'

function PreFormItem(props: FormItemProps) {
  const { children } = props
  const field = useContext(FieldContext)

  return (
    <div>
      <div>{field.title}</div>
      {children}
      <div className={styles.red}>{field.getState().description}</div>
    </div>
  )
}

export const FormItem = observer(PreFormItem)
