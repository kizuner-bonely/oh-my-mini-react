import type { RouteType } from './router.d'

export function useRoutes(routes: RouteType[]) {
  // todo 暂时这么取当前的路由地址
  const pathname = window.location.pathname

  return routes
    .filter(r => pathname === r.path || pathname === `/${r.path}`)
    .map(route => {
      return route.element
    })
}
