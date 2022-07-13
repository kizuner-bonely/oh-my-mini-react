import { createContext } from 'react'
import { matchRoutes } from 'react-router-dom'

type MatchType = ReturnType<typeof matchRoutes>

type RoutesService = {
  outlet: JSX.Element | null
  matches: MatchType
}

export const RoutesContext = createContext<RoutesService>({} as RoutesService)
