import { useState } from 'react'
import type { Column, Card } from './types'
import Board from './components/Board/Board'
import './App.css'

const defaultColumns: Column[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
]

function App() {
  const [columns] = useState<Column[]>(defaultColumns)
  const [cards, setCards] = useState<Card[]>([])

  const addCard = (columnId: string, title: string, description?: string) => {
    const cardsInColumn = cards.filter(card => card.columnId === columnId)
    const maxOrder = cardsInColumn.length > 0
      ? Math.max(...cardsInColumn.map(card => card.order))
      : -1

    const newCard: Card = {
      id: crypto.randomUUID(),
      title,
      description,
      columnId,
      order: maxOrder + 1,
    }

    setCards([...cards, newCard])
  }

  const updateCard = (cardId: string, updates: Partial<Pick<Card, 'title' | 'description'>>) => {
    setCards(cards.map(card =>
      card.id === cardId ? { ...card, ...updates } : card
    ))
  }

  const deleteCard = (cardId: string) => {
    const cardToDelete = cards.find(card => card.id === cardId)
    if (!cardToDelete) return

    const remainingCards = cards.filter(card => card.id !== cardId)

    const reorderedCards = remainingCards.map(card => {
      if (card.columnId === cardToDelete.columnId && card.order > cardToDelete.order) {
        return { ...card, order: card.order - 1 }
      }
      return card
    })

    setCards(reorderedCards)
  }

  return (
    <div className="app">
      <h1 className="app-title">Kanban Board</h1>
      <Board
        columns={columns}
        cards={cards}
        onAddCard={addCard}
        onUpdateCard={updateCard}
        onDeleteCard={deleteCard}
      />
    </div>
  )
}

export default App
