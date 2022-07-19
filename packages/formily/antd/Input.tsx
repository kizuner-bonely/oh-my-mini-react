import type { InputProps } from './antd.type'

export function Input(props: InputProps) {
  const { style, value } = props
  return (
    <input
      value={value}
      style={{
        border: '2px solid rgb(186 203 255)',
        borderRadius: 6,
        width: '100%',
        height: 28,
        padding: '0 5px',
        ...style,
      }}
    />
  )
}
