import type { Column, Card } from './types'

const STORAGE_KEY = 'kanban-board-state'

interface BoardState {
  columns: Column[];
  cards: Record<string, Card>;
}

export function loadState(): BoardState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as BoardState
    if (!Array.isArray(parsed.columns) || typeof parsed.cards !== 'object') {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function saveState(columns: Column[], cards: Record<string, Card>): void {
  try {
    const state: BoardState = { columns, cards }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Silently fail — localStorage may be full or unavailable
  }
}
