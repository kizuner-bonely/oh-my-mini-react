import type { RouteType } from './router.d'

export function useRoutes(routes: RouteType[]) {
  // todo 暂时这么取当前的路由地址
  const pathname = window.location.pathname

  return (
    routes
      // 渲染子路由的时候必渲染父路由，如果只用全等来判断，只能路由名完全相等的
      .filter(r => pathname.startsWith(r.path))
      .map(route => {
        return route.element
      })
  )
}
