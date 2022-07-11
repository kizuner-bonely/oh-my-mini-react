import { useContext } from 'react'
import { RouterContext } from '../LayoutRouter/routerContext'

export function useLocation() {
  const { location } = useContext(RouterContext)
  return location
}
