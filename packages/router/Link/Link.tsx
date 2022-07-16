import type { MouseEvent, CSSProperties } from 'react'
import { useCallback } from 'react'
import { useNavigate } from '../Navigate/useNavigate'

type LinkProps = {
  to: string
  children: string
  style?: CSSProperties
}

export function Link(props: LinkProps) {
  const { children, to, style } = props

  const navigate = useNavigate()

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      navigate(to)
    },
    [to],
  )

  return (
    <a href={to} onClick={handleClick} style={style}>
      {children}
    </a>
  )
}
