import { useResolvedPath } from './useResolvedPath'
import { useMatch } from './useMatch'
import { Link } from './Link'

type NavLinkProps = {
  to: string
  children: string
}

export function NavLink(props: NavLinkProps) {
  const { children, to } = props

  const resolved = useResolvedPath(to)
  const match = useMatch({ path: resolved.pathname, end: true })

  return (
    <Link style={{ color: match ? 'red' : '#333' }} to={to}>
      {children}
    </Link>
  )
}
