import type { Location } from 'react-router-dom'
import { useEffect } from 'react'
import { useNavigate } from './useNavigate'

type NavigateProps = {
  to: string
  state?: { from: Location }
  replace?: boolean
}

export function Navigate(props: NavigateProps) {
  const { to, state, replace } = props
  const navigate = useNavigate()

  useEffect(() => {
    navigate(to, { state, replace })
  }, [])

  return null
}
