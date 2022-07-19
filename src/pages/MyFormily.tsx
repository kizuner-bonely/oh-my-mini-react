import {
  createForm,
  FormProvider,
  Field,
  FormConsumer,
  FormItem,
  Input,
  Submit,
} from '@myFormily'

const form = createForm()

const createPasswordEqualValidate = (equalName: string) => (field: any) => {
  if (
    form.values.confirm_password &&
    field.value &&
    form.values[equalName] !== field.value
  ) {
    field.selfErrors = ['Password does not match Confirm Password.']
  } else {
    field.selfErrors = []
  }
}

export default function MyFormily() {
  return (
    <div>
      <h3>formily</h3>
      <FormProvider form={form}>
        <Field
          name="name"
          title="Name"
          required
          decorator={[FormItem]}
          component={[Input, { placeholder: 'Please Input' }]}
        />

        <Field
          name="password"
          title="Password"
          required
          decorator={[FormItem]}
          component={[Input, { type: 'password', placeholder: 'Please Input' }]}
          reactions={createPasswordEqualValidate('confirm_password')}
        />
        <Field
          name="confirm_password"
          title="Confirm Password"
          required
          decorator={[FormItem]}
          component={[Input, { type: 'password', placeholder: 'Please Input' }]}
          reactions={createPasswordEqualValidate('password')}
        />

        <Submit
          onSubmit={(res: string) => {
            console.log(res)
          }}
          onSubmitSuccess={() => {
            console.log('success')
          }}
          onSubmitFailed={(err: any) => {
            console.log('failed', err)
          }}
        >
          submit
        </Submit>

        <div>
          <FormConsumer>{() => form.values.name}</FormConsumer>
        </div>
      </FormProvider>
    </div>
  )
}
