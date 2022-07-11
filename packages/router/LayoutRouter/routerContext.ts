import type { BrowserHistory, Location } from 'history'
import { createContext } from 'react'

type RouterService = {
  navigator: BrowserHistory
  location: Location
}

export const RouterContext = createContext<RouterService>({} as RouterService)
