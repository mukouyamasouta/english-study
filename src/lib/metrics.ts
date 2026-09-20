import type { StudyLog, WeeklyMeasure } from './storage'

export function percent(value?: { correct: number; total: number }): number | undefined {
  if (!value || value.total <= 0) return undefined
  return Math.round((value.correct / value.total) * 100)
}

export function aggregateWeek(logs: StudyLog[]): { actualMinutes: number; plannedMinutes: number; doneDays: number; rate: number } {
  const actualMinutes = logs.reduce((sum, log) => sum + (log.done ? log.actualMinutes : 0), 0)
  const plannedMinutes = logs.reduce((sum, log) => sum + log.plannedMinutes, 0)
  const doneDays = logs.filter((log) => log.done).length
  return { actualMinutes, plannedMinutes, doneDays, rate: plannedMinutes ? Math.round((actualMinutes / plannedMinutes) * 100) : 0 }
}

export function topMissCode(measure?: WeeklyMeasure): string {
  const entries = Object.entries(measure?.missCounts ?? {}).sort(([, a], [, b]) => b - a)
  return entries[0]?.[0] ?? '—'
}

export function trendTableMarkdown(rows: string[]): string {
  return [
    '| Week | 実績/予定 | 実施日 | 達成率 | 主なミス | P5% | P7% |',
    '|---|---:|---:|---:|---|---:|---:|',
    ...rows,
  ].join('\n')
}

export function dailyLogLine(dateKey: string, weekday: string, log: StudyLog | undefined, plannedMinutes: number): string {
  if (!log) return `- ${dateKey}（${weekday}）: 未記録（予定${plannedMinutes}分）`
  const modeLabels: Record<StudyLog['mode'], string> = { normal: '通常', short: '時間がない', tired: '疲れた日' }
  return `- ${dateKey}（${weekday}）: ${log.done ? '完了' : '未完了'} 実績${log.actualMinutes}/予定${plannedMinutes}分 ${modeLabels[log.mode]}`
}
