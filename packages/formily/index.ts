import { createForm } from '@formily/core'
// import {
//   FormProvider,
//   Field,
//   FormConsumer,
//   FieldContext,
//   useParentForm,
// } from '@formily/react'
// import { observer } from '@formily/reactive-react'
import { observable, Tracker } from '@formily/reactive'
// import { observer } from '@formily/reactive-react'
// import { FormItem, Input, Submit } from '@formily/antd'

import { FormItem, Input, Submit } from './antd'
import {
  FormProvider,
  Field,
  FormConsumer,
  FieldContext,
  useParentForm,
} from './formily-react'
import { observer } from './reactive-react'

export {
  // core
  createForm,
  // react
  FormProvider,
  Field,
  FormConsumer,
  FieldContext,
  useParentForm, // 用于读取最近的 Form 或者 ObjectField 实例
  // reactive
  observable,
  Tracker,
  // reactive-react
  observer,
  // Tracker,
  // antd
  FormItem,
  Input,
  Submit,
}
