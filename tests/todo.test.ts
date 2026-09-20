import { describe, expect, it } from 'vitest'
import { roadmapVersion } from '../src/data/roadmap'
import { aggregateWeek } from '../src/lib/metrics'
import { aggregateTodoDay, aggregateTodoWeek, combinedMinutes } from '../src/lib/todo'
import { emptyData, parseImport, type StudyLog, type TodoLogEntry, type TodoTask } from '../src/lib/storage'
import { addAssessment, addTodoTask, appendGptExchange, appendReview } from '../src/lib/state'

const task = (id: string, plannedMinutes: number, archived = false): TodoTask => ({ id, name: id, plannedMinutes, order: 0, archived })

describe('ToDo集計', () => {
  it('連続したToDo追加は3件を保持し、IDと順序が重複しない', () => {
    const result = ['読書', '筋トレ', '散歩'].reduce((data, name, index) => addTodoTask(data, name, (index + 1) * 5), emptyData())
    expect(result.todoTasks).toHaveLength(3)
    expect(new Set(result.todoTasks.map((item) => item.id)).size).toBe(3)
    expect(result.todoTasks.map((item) => item.name)).toEqual(['読書', '筋トレ', '散歩'])
    expect(result.todoTasks.map((item) => item.order)).toEqual([0, 1, 2])
  })

  it('連続した評価追加は3件を保持し、IDが重複しない', () => {
    const result = [1, 2, 3].reduce((data, number) => addAssessment(data, { name: '過去テストA', date: `2026-09-${20 + number}` }), emptyData())
    expect(result.assessments).toHaveLength(3)
    expect(new Set(result.assessments.map((item) => item.id)).size).toBe(3)
  })

  it('連続したGPT相談とレビュー追加は先行エントリを破棄しない', () => {
    const withExchanges = [1, 2, 3].reduce((data, number) => appendGptExchange(data, { id: `exchange-${number}`, week: 1, createdAt: `2026-09-20T00:00:0${number}.000Z`, prompt: `prompt-${number}` }), emptyData())
    const result = ['one', 'two', 'three'].reduce((data, reply) => appendReview(data, 1, reply), withExchanges)
    expect(result.gptExchanges).toHaveLength(3)
    expect(new Set(result.gptExchanges.map((item) => item.id)).size).toBe(3)
    expect(result.reviews['1']).toEqual(['one', 'two', 'three'])
  })

  it('日次集計は実績・予定・完了数・タスク数を返す', () => {
    const tasks = [task('a', 20), task('b', 30)]
    const logs: Record<string, TodoLogEntry> = { a: { done: true, actualMinutes: 15, plannedMinutes: 20 }, b: { done: false, actualMinutes: 0, plannedMinutes: 30 } }
    expect(aggregateTodoDay(tasks, logs)).toEqual({ actualMinutes: 15, plannedMinutes: 50, doneCount: 1, totalCount: 2 })
  })

  it('週次集計は7日分を合算し、実施日数を数える', () => {
    const tasks = [task('a', 10)]
    const logs = {
      '2026-09-21': { a: { done: true, actualMinutes: 8, plannedMinutes: 10 } },
      '2026-09-22': { a: { done: true, actualMinutes: 12, plannedMinutes: 10 } },
    }
    expect(aggregateTodoWeek(['2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25', '2026-09-26', '2026-09-27'], logs, tasks)).toEqual({ actualMinutes: 20, plannedMinutes: 70, doneDays: 2 })
  })

  it('英語が完了したときだけToDoと合算する', () => {
    const english: StudyLog = { date: '2026-09-21', week: 1, weekday: '月', plannedMinutes: 30, roadmapVersion, mode: 'normal', actualMinutes: 25, done: true }
    const unfinished = { ...english, done: false }
    expect(combinedMinutes(english, { actualMinutes: 12 })).toBe(37)
    expect(combinedMinutes(undefined, { actualMinutes: 12 })).toBe(12)
    expect(combinedMinutes(unfinished, { actualMinutes: 12 })).toBe(12)
  })

  it('タスクをアーカイブしても過去ログのスナップショットは変わらない', () => {
    const logs = { '2026-09-20': { a: { done: true, actualMinutes: 18, plannedMinutes: 20 } } }
    const before = aggregateTodoDay([task('a', 20)], logs['2026-09-20'])
    const archived = [task('a', 999, true)]
    const after = aggregateTodoDay(archived, logs['2026-09-20'])
    expect(after).toEqual(before)
    expect(aggregateTodoWeek(['2026-09-20'], logs, archived)).toMatchObject({ actualMinutes: 18, plannedMinutes: 20 })
  })

  it('旧バックアップはToDo項目を空で補完して読み込める', () => {
    const old = { schemaVersion: 1, settings: { startDate: '2026-09-21' }, logs: {}, dayOverrides: {}, weeklyMeasures: {}, assessments: [], reviews: {}, gptExchanges: [] }
    const parsed = parseImport(JSON.stringify(old))
    expect(parsed).toMatchObject({ schemaVersion: 1, settings: old.settings, logs: {}, todoTasks: [], todoLogs: {} })
    expect(parsed?.todoLogs).toEqual({})
  })

  it('英語週次集計はToDoログの有無に影響されない', () => {
    const english: StudyLog[] = [{ date: '2026-09-21', week: 1, weekday: '月', plannedMinutes: 30, roadmapVersion, mode: 'normal', actualMinutes: 25, done: true }]
    const withTodo = { schemaVersion: 1 as const, settings: { startDate: '2026-09-21' }, logs: { [english[0].date]: english[0] }, dayOverrides: {}, weeklyMeasures: {}, assessments: [], reviews: {}, gptExchanges: [], todoTasks: [task('a', 100)], todoLogs: { '2026-09-21': { a: { done: true, actualMinutes: 100, plannedMinutes: 100 } } } }
    expect(aggregateWeek(english)).toEqual({ actualMinutes: 25, plannedMinutes: 30, doneDays: 1, rate: 83 })
    expect(withTodo.todoLogs['2026-09-21'].a.actualMinutes).toBe(100)
  })
})
