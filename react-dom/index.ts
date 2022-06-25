import { NoFlags } from '@react/Flags'
import { createFiber } from '@react/ReactFiber'
import { scheduleUpdateOnFiber } from '@react/ReactFiberWorkLoop'
import { HostComponent } from '@react/ReactWorkTags'
import { VnodeType } from '@react/types/VnodeType'
import type { Root } from './react-dom'

function createRoot(container: HTMLElement) {
  const root: Root = { containerInfo: container }

  return new ReactDOMRoot(root)
}

class ReactDOMRoot {
  constructor(private _internalRoot: Root) {}

  render(children: VnodeType) {
    // 此处拿到的 children 是 ReactElement，我们需要把它转换成 Fiber
    console.log('children', children)
    const root = this._internalRoot

    updateContainer(children, root)
  }
}

//* 对传入的 element 进行更新，并且从它开始进行深度优先遍历更新，直到回到 根Fiber
function updateContainer(element: VnodeType, container: Root) {
  const { containerInfo } = container

  const fiber = createFiber(element, {
    //! 重点
    type: containerInfo.nodeName.toLocaleLowerCase(),
    stateNode: containerInfo,
    // 次要
    key: null,
    props: {},
    tag: HostComponent,
    child: null,
    sibling: null,
    return: null,
    flags: NoFlags,
    index: null,
  })

  scheduleUpdateOnFiber(fiber)
}

export default { createRoot }
