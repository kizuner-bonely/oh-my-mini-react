export type FormConstructorProps = {
  initialValues?: Record<string, any>
}

export type FieldConstructorProps = {
  name: string
  component: JSX.Element
  decorator: any[]
}
