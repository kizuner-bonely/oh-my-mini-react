import { RoutesContext } from '../LayoutRouter/routesContext'
import { normalizePathname } from '../utils'
import type { RouteType } from '../router'
import { useLocation } from './useLocation'
import { Outlet } from '@router/Outlet/Outlet'

export function useRoutes(routes: RouteType[]) {
  const location = useLocation()
  const pathname = location.pathname

  return (
    routes
      // 渲染子路由的时候必渲染父路由，如果只用全等来判断，只能路由名完全相等的
      .filter(r => pathname.startsWith(r.path))
      .map(route => {
        if (route.children) {
          const c = Array.isArray(route.children)
            ? route.children
            : [route.children]

          return c.map(child => {
            const match = normalizePathname(child.path) === pathname
            if (match) {
              return (
                <RoutesContext.Provider
                  value={{ outlet: child.element as JSX.Element }}
                >
                  {route.element !== undefined ? route.element : <Outlet />}
                </RoutesContext.Provider>
              )
            }
          })
        }
      })
  )
}
