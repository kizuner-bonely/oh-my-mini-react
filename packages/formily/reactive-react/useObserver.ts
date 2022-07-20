import { useEffect, useRef } from 'react'
import { Tracker } from '@myFormily'
import { useForceUpdate } from './useForceUpdate'
import type { ReactFC } from '@formily/reactive-react'

export function useObserver(component: ReactFC<any>) {
  const forceUpdate = useForceUpdate()

  const tracker = useRef(new Tracker(forceUpdate)).current

  useEffect(() => {
    return () => {
      tracker.dispose()
    }
  }, [])

  return tracker.track(component)
}
