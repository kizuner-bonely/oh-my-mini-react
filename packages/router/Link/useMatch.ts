import { useMemo } from 'react'
import { matchPath } from 'react-router-dom'
import { useLocation } from '../Routes/useLocation'

type MatchPattern = {
  path: string
  end: boolean
}

export function useMatch(pattern: MatchPattern) {
  const { pathname } = useLocation()
  return useMemo(() => matchPath(pattern, pathname), [pathname, pattern])
}
