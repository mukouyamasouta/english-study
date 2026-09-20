import type { StudyLog, TodoLogEntry, TodoLogs, TodoTask } from './storage'

export type TodoDaySummary = { actualMinutes: number; plannedMinutes: number; doneCount: number; totalCount: number }

export function aggregateTodoDay(tasks: TodoTask[], dayLogs: Record<string, TodoLogEntry> | undefined): TodoDaySummary {
  const activeTasks = tasks.filter((task) => !task.archived)
  const activeIds = new Set(activeTasks.map((task) => task.id))
  const loggedEntries = Object.entries(dayLogs ?? {})
  const loggedIds = new Set(loggedEntries.map(([id]) => id))
  const activeWithoutLogs = activeTasks.filter((task) => !loggedIds.has(task.id))
  const activeEntries = activeTasks.filter((task) => loggedIds.has(task.id)).map((task) => [task.id, dayLogs![task.id]] as const)
  const archivedOrUnknownEntries = loggedEntries.filter(([id]) => !activeIds.has(id))
  const entries = [...activeEntries, ...archivedOrUnknownEntries]
  const actualMinutes = entries.reduce((sum, [, entry]) => sum + (entry.done ? Math.max(0, entry.actualMinutes) : 0), 0)
  const plannedMinutes = activeWithoutLogs.reduce((sum, task) => sum + Math.max(0, task.plannedMinutes), 0) + entries.reduce((sum, [, entry]) => sum + Math.max(0, entry.plannedMinutes), 0)
  const doneCount = entries.filter(([, entry]) => entry.done).length
  return { actualMinutes, plannedMinutes, doneCount, totalCount: activeWithoutLogs.length + entries.length }
}

export function aggregateTodoWeek(dates: string[], todoLogs: TodoLogs, tasks: TodoTask[]): { actualMinutes: number; plannedMinutes: number; doneDays: number } {
  const summaries = dates.map((date) => aggregateTodoDay(tasks, todoLogs[date]))
  return {
    actualMinutes: summaries.reduce((sum, summary) => sum + summary.actualMinutes, 0),
    plannedMinutes: summaries.reduce((sum, summary) => sum + summary.plannedMinutes, 0),
    doneDays: summaries.filter((summary) => summary.doneCount > 0).length,
  }
}

export function combinedMinutes(englishLog: StudyLog | undefined, todoDay: { actualMinutes: number }): number {
  return (englishLog?.done ? englishLog.actualMinutes : 0) + todoDay.actualMinutes
}
