export type TaskType = {
  id: number
  callback: (() => void) | null
  priorityLevel: number
  startTime: number
  expirationTime: number
  sortIndex: number
}
