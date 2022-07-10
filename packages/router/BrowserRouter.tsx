import type { ReactNode } from 'react'
import { useRef } from 'react'
import { createBrowserHistory } from 'history'
import { Router } from './Router'

type BrowserRouterProps = {
  children: ReactNode
}

export function BrowserRouter(props: BrowserRouterProps) {
  const { children } = props

  const navigator = useRef(createBrowserHistory()).current

  return <Router navigator={navigator}>{children}</Router>
}
