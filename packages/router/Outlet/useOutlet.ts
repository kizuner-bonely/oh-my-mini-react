import { RoutesContext } from '../Routes/routesContext'
import { useContext } from 'react'

export function useOutlet() {
  const { outlet } = useContext(RoutesContext)
  return outlet
}
