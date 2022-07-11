import type { RouteType } from '../router'

type RouteTypeProps = Pick<RouteType, 'path' | 'element'> & {
  children?: JSX.Element | JSX.Element[]
}

export function Route(props: RouteTypeProps) {
  return (
    <div>
      <h3>Route</h3>
    </div>
  )
}
