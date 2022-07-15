import type { MouseEvent } from 'react'
import { useCallback } from 'react'
import { useNavigate } from '../Navigate/useNavigate'

type LinkProps = {
  to: string
  children: string
}

export function Link(props: LinkProps) {
  const { children, to } = props

  const navigate = useNavigate()

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      navigate(to)
    },
    [to],
  )

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  )
}
