# Hello World

## 设计理念

React 是用 JS 构建 **快速响应** 的大型 web 应用程序的方式。

**制约快速响应的因素**

* IO ( 网络 )
* CPU ( 计算 )

浏览器每 16.6 ms 刷新一次 ( 1000ms / 60Hz )，每一帧要执行 **JS脚本**、**样式布局** 和 **样式绘制**。

如果 JS脚本执行时间过长，浏览器就没时间进行样式布局和样式绘制，呈现出来的效果就是掉帧。

**解决掉帧 -> 解决 JS脚本 执行时间过长问题**

* **异步更新** ( 可中断 )
* 节流、防抖 ( 治标不治本 )

React 解决 JS脚本执行过长的方式就是使用异步更新，React 会使用预留时间来执行 JS，当超过这个预留时间控制权会交还给浏览器，让它执行样式布局和绘制。

## 架构

自 React16 以来，React 的宏观架构分为以下几个部分：

**Scheduler ( 调度器 )** -> **Reconciler ( 协调器 )** -> **Renderer ( 渲染器 )**

不同优先级的任务会首先经过 Scheduler，Scheduler 会将优先级最高的任务送入 Reconciler，在 Reconciler 运行过程中，如果此时有一个更高优先级的任务，此时 Reconciler 的任务会暂停并压入任务栈中，并将更高优先级的任务送入 Reconciler，当完成该更高优先级的任务，再弹栈恢复上一次的任务。

需要注意的是，任务在 Renderer 中是不可中断的。

## 初识 Fiber

**Fiber** 在 React 中有三层含义

* Fiber 架构
* 一种数据结构
* 一种动态工作单元

**Fiber 架构**

在 React 的架构部分，Reconciler 负责的是组件树的 diff，而 fiber 则是 Reconciler 的组成单元，因此 React 的 Reconcile 也叫做 Fiber Reconcile。

**一种数据结构**

假设我们有如下组件

```react
function App() {
  const [count, setCount] = useState(0)

  return <div>{count}</div>
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
```

那首屏渲染时在内存中我们将得到如下内容：

![image-20220730230738963](img/1-首屏Fiber.png)

父组件的 child 指向的是第一个子节点，如果该子节点有兄弟节点，则该子节点会用 sibling 指向兄弟节点。

兄弟节点的 return 则指向父节点。

在 diff 时，如果存在节点复用，则会为节点创建一个新节点，二者用 alternate 互相引用。

当 work in progress 树更新完成时，`FiberRoot` 会将 current 指向 work in progress 并提交给 renderer 进行渲染。

**一种动态工作单元**

以下是 Fiber 的初始属性。

```ts
// Instance
this.tag = tag;
this.key = key;
this.elementType = null;
this.type = null;
this.stateNode = null;

// Fiber
this.return = null;
this.child = null;
this.sibling = null;
this.index = 0;

this.ref = null;

this.pendingProps = pendingProps;
this.memoizedProps = null;
this.updateQueue = null;
this.memoizedState = null;
this.dependencies = null;

this.mode = mode;

// Effects
this.flags = NoFlags;
this.subtreeFlags = NoFlags;
this.deletions = null;

this.lanes = NoLanes;
this.childLanes = NoLanes;

this.alternate = null;
```

React 中每个组件都是一个 Fiber，当然也包括原生节点 ( 需要注意的是 jsx 中写的 div 等原生节点并不完全等同于在 html 中写的 div 等原生节点，React 对它们进行了一层包装 )。

在项目运行时，有的属性会随着项目更新而跟着变化，比如 child、各种副作用、状态等等。