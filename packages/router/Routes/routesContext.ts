import { createContext } from 'react'

type RoutesService = {
  outlet: JSX.Element
}

export const RoutesContext = createContext<RoutesService>({} as RoutesService)
