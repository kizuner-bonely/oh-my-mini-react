import { ReactNode, useLayoutEffect, useState } from 'react'
import { useRef } from 'react'
import { createBrowserHistory } from 'history'
import { Router } from './Router'

type BrowserRouterProps = {
  children: ReactNode
}

export function BrowserRouter(props: BrowserRouterProps) {
  const { children } = props

  const navigator = useRef(createBrowserHistory()).current

  const [locationObj, setLocationObj] = useState({
    location: navigator.location,
  })

  useLayoutEffect(() => {
    navigator.listen(setLocationObj)
  }, [])

  return (
    <Router navigator={navigator} location={locationObj.location}>
      {children}
    </Router>
  )
}
