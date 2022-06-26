export type TaskType = {
  id: number
  callback: typeof Function
  priorityLevel: number
  startTime: number
  expirationTime: number
  sortIndex: number
}
