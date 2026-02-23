import { useState } from 'react'
import type { Column, Card } from './types'
import Board from './Board'
import './App.css'

const DEFAULT_COLUMNS: Column[] = [
  { id: 'col-todo', title: 'Todo', cardIds: [] },
  { id: 'col-inprogress', title: 'In Progress', cardIds: [] },
  { id: 'col-done', title: 'Done', cardIds: [] },
]

function App() {
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS)
  const [cards, setCards] = useState<Record<string, Card>>({})

  const handleAddCard = (columnId: string, title: string, description: string) => {
    const id = crypto.randomUUID()
    const newCard: Card = { id, title, description }
    setCards((prev) => ({ ...prev, [id]: newCard }))
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, cardIds: [...col.cardIds, id] } : col
      )
    )
  }

  const handleUpdateCard = (cardId: string, title: string, description: string) => {
    setCards((prev) => ({
      ...prev,
      [cardId]: { ...prev[cardId], title, description },
    }))
  }

  const handleDeleteCard = (columnId: string, cardId: string) => {
    setCards((prev) => {
      const next = { ...prev }
      delete next[cardId]
      return next
    })
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, cardIds: col.cardIds.filter((id) => id !== cardId) }
          : col
      )
    )
  }

  const handleMoveCard = (cardId: string, fromColumnId: string, toColumnId: string, newIndex: number) => {
    setColumns((prev) => {
      const newColumns = prev.map((col) => ({ ...col, cardIds: [...col.cardIds] }))
      const fromCol = newColumns.find((col) => col.id === fromColumnId)
      const toCol = newColumns.find((col) => col.id === toColumnId)
      if (!fromCol || !toCol) return prev

      const oldIndex = fromCol.cardIds.indexOf(cardId)
      if (oldIndex === -1) return prev

      fromCol.cardIds.splice(oldIndex, 1)
      toCol.cardIds.splice(newIndex, 0, cardId)

      return newColumns
    })
  }

  const handleMoveColumn = (columnId: string, newIndex: number) => {
    setColumns((prev) => {
      const oldIndex = prev.findIndex((col) => col.id === columnId)
      if (oldIndex === -1 || oldIndex === newIndex) return prev
      const next = [...prev]
      const [removed] = next.splice(oldIndex, 1)
      next.splice(newIndex, 0, removed)
      return next
    })
  }

  return (
    <div className="app">
      <h1>Kanban Board</h1>
      <Board
        columns={columns}
        cards={cards}
        onAddCard={handleAddCard}
        onUpdateCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
        onMoveCard={handleMoveCard}
        onMoveColumn={handleMoveColumn}
      />
    </div>
  )
}

export default App
