import type { BrowserHistory, Location } from 'history'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import { RouterContext } from './routerContext'

type RouterProps = {
  navigator: BrowserHistory
  location: Location
  children: ReactNode
}

export function Router(props: RouterProps) {
  const { navigator, children } = props
  const routerService = useRef({ navigator, location }).current

  return (
    <RouterContext.Provider value={routerService}>
      {children}
    </RouterContext.Provider>
  )
}
