import type { Location } from 'react-router-dom'
import { useCallback, useContext } from 'react'
import { RouterContext } from '../LayoutRouter/routerContext'

type NavigateOptions = {
  state?: { from: Location }
  replace?: boolean
}

export function useNavigate() {
  const { navigator } = useContext(RouterContext)

  const navigate = useCallback(
    (to: string | number, options?: NavigateOptions) => {
      if (typeof to === 'number') return navigator.go(to)

      if (options?.replace) {
        navigator.replace(to)
      } else {
        navigator.push(to, options?.state)
      }
    },
    [],
  )

  return navigate
}
