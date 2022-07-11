import { Children } from 'react'
import { useRoutes } from './useRoutes'
import type { RouteType } from '../router.d'

type RoutesProps = {
  children: JSX.Element | JSX.Element[]
}

export function Routes(props: RoutesProps) {
  const { children } = props
  const routes = createRoutesFromChildren(children)

  const routesElements = useRoutes(routes)
  return <>{routesElements}</>
}

function createRoutesFromChildren(children: JSX.Element | JSX.Element[]) {
  const routes: RouteType[] = []

  Children.forEach(children, child => {
    const { children, element, path } = child.props as RouteType & {
      children?: JSX.Element | JSX.Element[]
    }
    const route: RouteType = { element, path }

    if (children) {
      route.children = createRoutesFromChildren(children)
    }

    routes.push(route)
  })

  return routes
}
