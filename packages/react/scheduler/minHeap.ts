import type { TaskType } from '@type/TaskType'

export function peek(taskQueue: TaskType[]) {
  return taskQueue.length ? taskQueue[0] : null
}

export function push(taskQueue: TaskType[], task: TaskType) {
  taskQueue.push(task)
  shiftUp(taskQueue, taskQueue.length - 1)
}

export function pop(taskQueue: TaskType[]) {
  if (!taskQueue.length) return null
  if (taskQueue.length === 1) return taskQueue.pop()

  const res = taskQueue[0]
  taskQueue[0] = taskQueue.pop()!
  shiftDown(taskQueue, 0)

  return res
}

function shiftUp(taskQueue: TaskType[], ind: number) {
  let parentInd: number
  while (ind > 0) {
    parentInd = (ind - 1) >> 1

    if (compare(taskQueue[ind], taskQueue[parentInd]) < 0) {
      swap(taskQueue, ind, parentInd)
    } else {
      break
    }

    ind = parentInd
  }
}

function shiftDown(taskQueue: TaskType[], ind: number) {
  let leftInd: number,
    rightInd: number,
    target = ind

  while (ind < taskQueue.length - 1) {
    leftInd = (ind << 1) + 1
    rightInd = (ind << 1) + 2

    if (
      leftInd < taskQueue.length &&
      compare(taskQueue[leftInd], taskQueue[target]) < 0
    ) {
      target = leftInd
    }

    if (
      rightInd < taskQueue.length &&
      compare(taskQueue[rightInd], taskQueue[target]) < 0
    ) {
      target = rightInd
    }

    if (ind === target) break
    swap(taskQueue, ind, target)
    ind = target
  }
}

function compare(a: TaskType, b: TaskType) {
  const diff = a.sortIndex - b.sortIndex
  return diff ? diff : a.id - b.id
}

function swap(arr: unknown[], a: number, b: number) {
  ;[arr[a], arr[b]] = [arr[b], arr[a]]
}
