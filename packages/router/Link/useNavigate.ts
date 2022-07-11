import { useContext } from 'react'
import { RouterContext } from '../LayoutRouter/routerContext'

export function useNavigate() {
  const { navigator } = useContext(RouterContext)
  return navigator.push
}
