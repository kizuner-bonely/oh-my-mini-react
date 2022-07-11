import { useOutlet } from './useOutlet'

export function Outlet() {
  const outlet = useOutlet()!
  return outlet
}
