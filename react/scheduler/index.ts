import type { TaskType } from '@type/TaskType'
import { peek, pop, push } from './minHeap'

const taskQueue: TaskType[] = []
let taskIdCounter = 1

const channel = new MessageChannel()
const port = channel.port2
channel.port1.onmessage = () => {
  workLoop()
}

export function scheduleCallback(callback: () => void) {
  const currentTime = getCurrentTime()
  const timeout = -1 // 这里暂时不设计优先级，默认所有任务优先级相等

  const expirationTime = currentTime - timeout

  // 1.创建任务并将其推入任务池
  const newTask: TaskType = {
    id: taskIdCounter++,
    callback,
    startTime: currentTime,
    expirationTime,
    sortIndex: expirationTime,
    priorityLevel: 0,
  }

  push(taskQueue, newTask)

  // 2.请求调度
  requestHostCallback()
}

//* 获取当前时间
function getCurrentTime() {
  return performance.now()
}

//* 通知调度
function requestHostCallback() {
  port.postMessage(null)
}

//* 调度具体执行
function workLoop() {
  let currentTask = peek(taskQueue)
  // 在此处应该检查剩余时间和任务是否执行完成
  while (currentTask) {
    const cb = currentTask.callback!
    currentTask.callback = null
    cb()
    pop(taskQueue)
    currentTask = peek(taskQueue)
  }
}
