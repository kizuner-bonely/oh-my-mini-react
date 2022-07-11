import { RoutesContext } from './../LayoutRouter/routesContext'
import { useContext } from 'react'

export function useOutlet() {
  const { outlet } = useContext(RoutesContext)
  return outlet
}
