import type { ReducerType, HookType } from '@type/hooks'
import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop'
import type { FiberType } from './types/VnodeType'

let currentlyRenderingFiber: FiberType | null = null
let workInProgressHook: HookType | null = null

export function renderWithHooks(wip: FiberType) {
  currentlyRenderingFiber = wip
  currentlyRenderingFiber.memorizedState = null
  workInProgressHook = null
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
    } else {
      // hook0
      workInProgressHook = hook = currentlyRenderingFiber!
        .memorizedState as HookType
    }
  } else {
    // 组件初次渲染
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

export function useReducer(reducer: ReducerType, initialState: any) {
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
  reducer: ReducerType,
  // action?: any,
) {
  // 获取最新值
  hook.memorizedState = reducer(hook.memorizedState)
  // 保存当前节点 ( 老节点 )
  fiber!.alternate = { ...fiber! }
  fiber.sibling = null
  // 调度更新
  scheduleUpdateOnFiber(fiber!)
}
