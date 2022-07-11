import type { RouteType } from '../router.d'
import { useLocation } from './useLocation'

export function useRoutes(routes: RouteType[]) {
  const location = useLocation()
  const pathname = location.pathname

  return (
    routes
      // 渲染子路由的时候必渲染父路由，如果只用全等来判断，只能路由名完全相等的
      .filter(r => pathname.startsWith(r.path))
      .map(route => {
        return route.element
      })
  )
}
