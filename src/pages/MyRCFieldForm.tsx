import { useEffect } from 'react'
import Form, { Field } from '@form'
import { Input } from '@form/components'

const nameRules = { required: true, message: '请输入姓名！' }
const passwordRules = { required: true, message: '请输入密码！' }

export default function MyRCFieldForm() {
  const [form] = Form.useForm()

  const onFinish = (val: any) => {
    console.log('onFinish', val)
  }

  // 表单校验失败执行
  const onFinishFailed = (val: any) => {
    console.log('onFinishFailed', val)
  }

  useEffect(() => {
    console.log('form', form)
    // form.setFieldsValue({ username: "default" });
  }, [])

  return (
    <div>
      <h3>MyRCFieldForm</h3>
      <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Field name="username" rules={[nameRules]}>
          <Input placeholder="input UR Username" />
        </Field>
        <Field name="password" rules={[passwordRules]}>
          <Input placeholder="input UR Password" />
        </Field>
        <button>Submit</button>
      </Form>
    </div>
  )
}
