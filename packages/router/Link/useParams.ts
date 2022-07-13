import { useContext } from 'react'
import { RoutesContext } from '@router/Routes/routesContext'

export function useParams() {
  const { matches } = useContext(RoutesContext)
  return matches?.[matches?.length - 1].params
}
