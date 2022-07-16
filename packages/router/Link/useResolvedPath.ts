import { useMemo } from 'react'

export function useResolvedPath(to: string) {
  return useMemo(() => ({ pathname: to, hash: '', search: '' }), [to])
}
