import { describe, expect, it } from 'vitest'
import { blocks, roadmapVersion, weeks, weekdayPlans } from '../src/data/roadmap'
import { aggregateWeek, dailyLogLine, trendTableMarkdown } from '../src/lib/metrics'
import { addDays, blockForWeek, canRecordToday, dateKey, distinctTrendWeeks, nextCheckpoint, weekPosition, weekdayFor } from '../src/lib/date'
import { emptyData, parseImport, serializeData } from '../src/lib/storage'

describe('日付・週計算', () => {
  const start = '2026-09-21'
  it('開始前、開始日、7日目、8日目、最終週、終了後を計算する', () => {
    expect(weekPosition(start, '2026-09-20')).toMatchObject({ status: 'before', week: 1, daysUntilStart: 1 })
    expect(weekPosition(start, '2026-09-21')).toMatchObject({ status: 'active', week: 1, dayIndex: 0 })
    expect(weekPosition(start, '2026-09-27')).toMatchObject({ status: 'active', week: 1, dayIndex: 6 })
    expect(weekPosition(start, '2026-09-28')).toMatchObject({ status: 'active', week: 2, dayIndex: 0 })
    expect(weekPosition(start, addDays(start, 77 * 7 + 6))).toMatchObject({ status: 'active', week: 78, dayIndex: 6 })
    expect(weekPosition(start, addDays(start, 78 * 7))).toMatchObject({ status: 'after', week: 78 })
  })
  it('2026-09-21は月曜で、日付キーはUTCずれしない', () => {
    expect(weekdayFor('2026-09-21')).toBe('月')
    expect(dateKey(new Date(2026, 8, 21, 0, 1))).toBe('2026-09-21')
  })
  it('次のCheckpointは現在週以上の最初のもの', () => {
    expect(nextCheckpoint(1)).toBe(13)
    expect(nextCheckpoint(13)).toBe(13)
    expect(nextCheckpoint(14)).toBe(26)
    expect(nextCheckpoint(78)).toBe(78)
  })
  it('週からブロックを求める', () => {
    expect(blockForWeek(1)).toBe(1)
    expect(blockForWeek(13)).toBe(1)
    expect(blockForWeek(14)).toBe(2)
    expect(blockForWeek(78)).toBe(6)
  })
  it('相談トレンドは重複しない直近週を返す', () => {
    expect(distinctTrendWeeks(1)).toEqual([1])
    expect(distinctTrendWeeks(2)).toEqual([1, 2])
    expect(distinctTrendWeeks(5)).toEqual([2, 3, 4, 5])
  })
  it('開始前と完走後は今日の記録を保存できない', () => {
    expect(canRecordToday('before')).toBe(false)
    expect(canRecordToday('after')).toBe(false)
    expect(canRecordToday('active')).toBe(true)
  })
})

describe('ロードマップの完全性', () => {
  it('78週、各週の重点と成果物、ブロック範囲、曜日100分を満たす', () => {
    expect(weeks).toHaveLength(78)
    expect(weeks.every((week) => week.focus.length > 0 && week.deliverable.length > 0)).toBe(true)
    expect(blocks[0].weeks[0]).toBe(1)
    expect(blocks[blocks.length - 1].weeks[1]).toBe(78)
    expect(blocks.every((block, index) => block.weeks[0] === index * 13 + 1 && block.weeks[1] === index * 13 + 13)).toBe(true)
    expect(weekdayPlans.reduce((sum, item) => sum + item.minutes, 0)).toBe(100)
  })
})

describe('週次集計・バックアップ', () => {
  it('短時間モードは10/30分で33%、完了日は数える', () => {
    const logs = [{ date: '2026-09-21', week: 1, weekday: '月', plannedMinutes: 30, roadmapVersion, mode: 'short' as const, actualMinutes: 10, done: true }]
    expect(aggregateWeek(logs)).toMatchObject({ actualMinutes: 10, plannedMinutes: 30, doneDays: 1, rate: 33 })
  })
  it('export/importがラウンドトリップする', () => {
    const data = emptyData()
    data.logs['2026-09-21'] = { date: '2026-09-21', week: 1, weekday: '月', plannedMinutes: 10, roadmapVersion, mode: 'normal', actualMinutes: 10, done: true }
    data.weeklyMeasures['1'] = { newWords: 18, recurrenceRate: 40 }
    expect(parseImport(serializeData(data))).toEqual(data)
    expect(parseImport(JSON.stringify({ schemaVersion: 2 }))).toBeNull()
  })
})

describe('データ初期値', () => {
  it('空データはschemaVersion 1', () => expect(emptyData().schemaVersion).toBe(1))
})

describe('相談用日別ログ', () => {
  it('実ログは日本語モードと実績・予定を表示する', () => {
    const log = { date: '2026-09-21', week: 1, weekday: '月', plannedMinutes: 30, roadmapVersion, mode: 'short' as const, actualMinutes: 10, done: true }
    expect(dailyLogLine(log.date, log.weekday, log, 30).includes('完了 実績10/予定30分 時間がない')).toBe(true)
  })
  it('未記録日は予定だけを表示する', () => {
    const line = dailyLogLine('2026-09-22', '火', undefined, 20)
    expect(line.includes('未記録（予定20分）')).toBe(true)
    expect(line.includes('実績')).toBe(false)
    expect(line.includes('完了')).toBe(false)
  })
})

describe('相談用直近4週トレンド', () => {
  it('見出し、区切り、データ行が7列で揃う', () => {
    const table = trendTableMarkdown(['| 1 | 10/100分 | 1/6 | 10% | P1 | 20% | 30% |'])
    const rows = table.split('\n')
    const columnCount = (row: string) => row.split('|').length - 2

    expect(columnCount(rows[0])).toBe(7)
    expect(columnCount(rows[1])).toBe(7)
    expect(columnCount(rows[2])).toBe(7)
  })
})
