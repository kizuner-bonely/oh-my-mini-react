import type { BrowserHistory } from 'history'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import { RouterContext } from './routerContext'

type RouterProps = {
  navigator: BrowserHistory
  children: ReactNode
}

export function Router(props: RouterProps) {
  const { navigator, children } = props
  const routerService = useRef({ navigator }).current

  return (
    <RouterContext.Provider value={routerService}>
      {children}
    </RouterContext.Provider>
  )
}
