import type { BrowserHistory } from 'history'
import { createContext } from 'react'

type RouterService = {
  navigator: BrowserHistory
}

export const RouterContext = createContext<RouterService>({} as RouterService)
