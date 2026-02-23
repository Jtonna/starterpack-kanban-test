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

  return (
    <div className="app">
      <h1>Kanban Board</h1>
      <Board
        columns={columns}
        cards={cards}
        onAddCard={handleAddCard}
        onUpdateCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
      />
    </div>
  )
}

export default App
