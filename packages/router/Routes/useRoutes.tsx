import { RoutesContext } from './routesContext'
import type { RouteType } from '../router'
import { useLocation } from './useLocation'
import { matchRoutes } from 'react-router-dom'
// import { normalizePathname } from '../utils'
// import { Outlet } from '@router/Outlet/Outlet'

type MatchType = ReturnType<typeof matchRoutes>

export function useRoutes(routes: RouteType[]) {
  const location = useLocation()
  const pathname = location.pathname

  const matches = matchRoutes(routes as any, { pathname })

  return renderMatches(matches)
}

function renderMatches(matches: MatchType) {
  if (!matches) return null

  return matches.reduceRight((outlet, match) => {
    return (
      <RoutesContext.Provider value={{ outlet, matches }}>
        {match.route.element || outlet}
      </RoutesContext.Provider>
    )
  }, null as any)
}
