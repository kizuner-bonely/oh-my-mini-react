import type { ReactFC } from '@formily/reactive-react'
import { useObserver } from './useObserver'

export function observer(component: ReactFC<any>) {
  const WrappedComponent = (props: any) => {
    return useObserver(() => component({ ...props }))
  }

  return WrappedComponent
}
