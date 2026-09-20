import { blocks } from '../data/roadmap'

export type WeekPosition = { status: 'before' | 'active' | 'after'; week: number; dayIndex: number; daysUntilStart?: number }

function parts(key: string): [number, number, number] {
  const [year, month, day] = key.split('-').map(Number)
  return [year, month, day]
}

export function dateKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addDays(key: string, amount: number): string {
  const [year, month, day] = parts(key)
  const date = new Date(year, month - 1, day + amount)
  return dateKey(date)
}

export function daysBetween(from: string, to: string): number {
  const [fy, fm, fd] = parts(from)
  const [ty, tm, td] = parts(to)
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86400000)
}

export function weekdayFor(key: string): '月' | '火' | '水' | '木' | '金' | '土' | '日' {
  const [year, month, day] = parts(key)
  return (['日', '月', '火', '水', '木', '金', '土'] as const)[new Date(year, month - 1, day).getDay()]
}

export function weekPosition(startDate: string, today: string): WeekPosition {
  const diff = daysBetween(startDate, today)
  if (diff < 0) return { status: 'before', week: 1, dayIndex: 0, daysUntilStart: Math.abs(diff) }
  if (diff >= 78 * 7) return { status: 'after', week: 78, dayIndex: 6 }
  return { status: 'active', week: Math.floor(diff / 7) + 1, dayIndex: diff % 7 }
}

export function canRecordToday(status: WeekPosition['status']): boolean {
  return status === 'active'
}

export function distinctTrendWeeks(viewWeek: number, count = 4): number[] {
  const end = Math.max(0, viewWeek)
  const start = Math.max(1, end - count + 1)
  return end < 1 ? [] : Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

export function blockForWeek(week: number): number {
  const block = blocks.find((item) => week >= item.weeks[0] && week <= item.weeks[1])
  return block?.block ?? 6
}

export function datesForWeek(startDate: string, week: number): string[] {
  return Array.from({ length: 7 }, (_, index) => addDays(startDate, (week - 1) * 7 + index))
}

export function nextCheckpoint(week: number): number {
  return [13, 26, 39, 52, 65, 78].find((checkpoint) => checkpoint >= week) ?? 78
}

export function formatJapaneseDate(key: string): string {
  const [year, month, day] = parts(key)
  return `${year}/${month}/${day}（${weekdayFor(key)}）`
}
