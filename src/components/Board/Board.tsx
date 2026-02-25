import { useState } from 'react'
import type { ColumnData, CardData } from '../../types/board'
import Column from '../Column/Column'
import './Board.css'

const DEFAULT_COLUMNS: ColumnData[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
]

function Board() {
  const [cards, setCards] = useState<CardData[]>([])
  const [columns, setColumns] = useState<ColumnData[]>(DEFAULT_COLUMNS)

  function handleAddCard(columnId: string, title: string, description?: string) {
    const newCard: CardData = {
      id: crypto.randomUUID(),
      title,
      description,
      columnId,
    }
    setCards((prev) => [...prev, newCard])
  }

  function handleUpdateCard(cardId: string, title: string, description?: string) {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, title, description } : card
      )
    )
  }

  function handleDeleteCard(cardId: string) {
    setCards((prev) => prev.filter((card) => card.id !== cardId))
  }

  return (
    <div className="board">
      {columns.map((col) => (
        <Column
          key={col.id}
          columnId={col.id}
          title={col.title}
          cards={cards.filter((c) => c.columnId === col.id)}
          onAddCard={handleAddCard}
          onUpdateCard={handleUpdateCard}
          onDeleteCard={handleDeleteCard}
        />
      ))}
    </div>
  )
}

export default Board
