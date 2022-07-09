type BrowserRouterProps = {
  children: JSX.Element
}

// export const BrowserRouter: FC<BrowserRouterProps> = props => {
//   const { children } = props
//   return children
// }

export function BrowserRouter(props: BrowserRouterProps) {
  const { children } = props
  return children!
}
