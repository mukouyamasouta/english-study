import { makeId, type AppData, type Assessment, type GptExchange } from './storage'

export function addTodoTask(data: AppData, name: string, plannedMinutes: number): AppData {
  return {
    ...data,
    todoTasks: [...data.todoTasks, {
      id: makeId(),
      name: name.trim(),
      plannedMinutes: Math.max(0, plannedMinutes),
      order: data.todoTasks.reduce((max, task) => Math.max(max, task.order), -1) + 1,
      archived: false,
    }],
  }
}

export function addAssessment(data: AppData, assessment: Omit<Assessment, 'id'>): AppData {
  return { ...data, assessments: [...data.assessments, { id: makeId(), ...assessment }] }
}

export function appendGptExchange(data: AppData, exchange: GptExchange): AppData {
  return { ...data, gptExchanges: [...data.gptExchanges, exchange] }
}

export function appendReview(data: AppData, week: number, reply: string): AppData {
  const key = String(week)
  return { ...data, reviews: { ...data.reviews, [key]: [...(data.reviews[key] ?? []), reply] } }
}
