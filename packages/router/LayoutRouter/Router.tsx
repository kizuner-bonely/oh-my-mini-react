import type { BrowserHistory, Location } from 'history'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { RouterContext } from './routerContext'

type RouterProps = {
  navigator: BrowserHistory
  location: Location
  children: ReactNode
}

export function Router(props: RouterProps) {
  const { navigator, location, children } = props
  const routerService = useMemo(() => {
    return { navigator, location }
  }, [navigator, location])

  return (
    <RouterContext.Provider value={routerService}>
      {children}
    </RouterContext.Provider>
  )
}
