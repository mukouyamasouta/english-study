import { roadmapVersion } from '../data/roadmap'

export const STORAGE_KEY = 'erm:v1'

export type Mode = 'normal' | 'short' | 'tired'
export type StudyLog = {
  date: string
  week: number
  weekday: string
  plannedMinutes: number
  roadmapVersion: typeof roadmapVersion
  mode: Mode
  actualMinutes: number
  done: boolean
  memo?: string
}

export type WeeklyMeasure = {
  p2?: { correct: number; total: number }
  p34?: { correct: number; total: number }
  p5?: { correct: number; total: number }
  p7?: { correct: number; total: number }
  vocabulary7d?: { correct: number; total: number }
  newWords?: number
  missCounts?: Record<string, number>
  recurrenceRate?: number
  nextMemo?: string
  memo?: string
}

export type Assessment = { id: string; name: string; date: string; listening?: number; reading?: number; total?: number }
export type GptExchange = { id: string; week: number; createdAt: string; prompt: string; reply?: string }
export type AppData = {
  schemaVersion: 1
  settings: { startDate: string; lastBackupAt?: string }
  logs: Record<string, StudyLog>
  dayOverrides: Record<string, { mode?: Mode }>
  weeklyMeasures: Record<string, WeeklyMeasure>
  assessments: Assessment[]
  reviews: Record<string, string[]>
  gptExchanges: GptExchange[]
}

export function emptyData(startDate = '2026-09-21'): AppData {
  return { schemaVersion: 1, settings: { startDate }, logs: {}, dayOverrides: {}, weeklyMeasures: {}, assessments: [], reviews: {}, gptExchanges: [] }
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyData()
    const parsed = JSON.parse(raw) as Partial<AppData>
    if (parsed.schemaVersion !== 1) return emptyData()
    return {
      ...emptyData(),
      ...parsed,
      settings: { ...emptyData().settings, ...(parsed.settings ?? {}) },
      logs: parsed.logs ?? {}, dayOverrides: parsed.dayOverrides ?? {}, weeklyMeasures: parsed.weeklyMeasures ?? {},
      assessments: parsed.assessments ?? [], reviews: parsed.reviews ?? {}, gptExchanges: parsed.gptExchanges ?? [],
    }
  } catch {
    return emptyData()
  }
}

export function saveData(data: AppData): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch { /* storage may be unavailable */ }
}

export function serializeData(data: AppData): string { return JSON.stringify(data, null, 2) }

export function parseImport(text: string): AppData | null {
  try {
    const parsed = JSON.parse(text) as Partial<AppData>
    if (parsed.schemaVersion !== 1 || !parsed.settings || typeof parsed.settings.startDate !== 'string' || typeof parsed.logs !== 'object') return null
    return { ...emptyData(), ...parsed, settings: { ...emptyData().settings, ...parsed.settings }, logs: parsed.logs ?? {}, dayOverrides: parsed.dayOverrides ?? {}, weeklyMeasures: parsed.weeklyMeasures ?? {}, assessments: parsed.assessments ?? [], reviews: parsed.reviews ?? {}, gptExchanges: parsed.gptExchanges ?? [] }
  } catch { return null }
}

export function makeId(): string { return `${Date.now()}-${Math.random().toString(36).slice(2)}` }
