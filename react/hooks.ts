import type { ReducerType, HookType, EffectType } from '@type/hooks'
import type { FiberType } from './types/VnodeType'
import { HookLayout, HookPassive } from './Flags'
import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop'
import { areHooksDepsEquals } from '@utils'

let currentlyRenderingFiber: FiberType | null = null
let workInProgressHook: HookType | null = null
let currentHook: HookType | null = null

export function renderWithHooks(wip: FiberType) {
  currentlyRenderingFiber = wip
  currentlyRenderingFiber.memorizedState = null
  workInProgressHook = null

  //! 源码中 layoutEffect 和 effect 放在一个单向环形链表上
  //! 这里为了方便分别用数组实现
  currentlyRenderingFiber.updateQueueOfEffect = []
  currentlyRenderingFiber.updateQueueOfLayout = []
}

function updateWorkInProgressHook() {
  let hook: HookType

  const current = currentlyRenderingFiber?.alternate
  if (current) {
    // 组件更新
    currentlyRenderingFiber!.memorizedState = current.memorizedState

    if (workInProgressHook) {
      // 下一个 hook
      workInProgressHook = hook = workInProgressHook.next!
      currentHook = currentHook!.next
    } else {
      // hook0
      workInProgressHook = hook = currentlyRenderingFiber!
        .memorizedState as HookType
      currentHook = current.memorizedState as HookType
    }
  } else {
    // 组件初次渲染
    currentHook = null

    hook = {
      memorizedState: null, // state
      next: null, // 下一个 hook
    }

    if (workInProgressHook) {
      // 下一个 hook
      workInProgressHook = workInProgressHook.next = hook
    } else {
      // hook0
      workInProgressHook = currentlyRenderingFiber!.memorizedState = hook
    }
  }

  return hook
}

export function useReducer(reducer: ReducerType | null, initialState: any) {
  const hook = updateWorkInProgressHook()

  if (!currentlyRenderingFiber?.alternate) {
    // 初次渲染
    hook.memorizedState = initialState
  }

  const dispatch = dispatchReducerAction.bind(
    null,
    currentlyRenderingFiber as FiberType,
    hook,
    reducer,
  )

  return [hook.memorizedState, dispatch]
}

function dispatchReducerAction(
  fiber: FiberType,
  hook: HookType,
  reducer: ReducerType | null,
  action: any, // 如果是 useState，这里可能是一个普通值，也可能是函数，总之由用户在外界传入
) {
  // 获取最新值
  hook.memorizedState = reducer ? reducer(hook.memorizedState) : action
  // 保存当前节点 ( 老节点 )
  fiber!.alternate = { ...fiber! }
  fiber.sibling = null
  // 调度更新
  scheduleUpdateOnFiber(fiber!)
}

export function useState<T>(initialState: T) {
  return useReducer(null, initialState)
}

export function useEffect(create: () => void, deps: any[] | null = null) {
  return useEffectImpl(HookPassive, create, deps)
}

export function useLayoutEffect(create: () => void, deps: any[] | null = null) {
  return useEffectImpl(HookLayout, create, deps)
}

export function useEffectImpl(
  flag: number,
  create: () => void,
  deps: any[] | null = null,
) {
  const hook = updateWorkInProgressHook()

  if (currentHook) {
    const prevEffect = currentHook.memorizedState
    if (deps) {
      const prevDeps = prevEffect.deps
      // 依赖项没变则不执行
      if (areHooksDepsEquals(deps, prevDeps)) {
        return
      }
    }
  }

  const effect: EffectType = { flag, create, deps }

  hook.memorizedState = effect

  if (flag & HookPassive) {
    currentlyRenderingFiber!.updateQueueOfEffect!.push(effect)
  } else if (flag & HookLayout) {
    currentlyRenderingFiber!.updateQueueOfLayout!.push(effect)
  }
}
