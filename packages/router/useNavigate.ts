import { useContext } from 'react'
import { RouterContext } from './routerContext'

export function useNavigate() {
  const { navigator } = useContext(RouterContext)
  return navigator.push
}
