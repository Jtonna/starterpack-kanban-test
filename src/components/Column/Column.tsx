import { useState } from 'react'
import type { CardData } from '../../types/board'
import Card from '../Card/Card'
import './Column.css'

interface ColumnProps {
  columnId: string
  title: string
  cards: CardData[]
  onAddCard: (columnId: string, title: string, description?: string) => void
  onUpdateCard: (cardId: string, title: string, description?: string) => void
  onDeleteCard: (cardId: string) => void
}

function Column({ columnId, title, cards, onAddCard, onUpdateCard, onDeleteCard }: ColumnProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')

  function handleAdd() {
    const trimmed = newTitle.trim()
    if (!trimmed) return
    onAddCard(columnId, trimmed, newDescription.trim() || undefined)
    setNewTitle('')
    setNewDescription('')
    setIsAdding(false)
  }

  function handleCancelAdd() {
    setNewTitle('')
    setNewDescription('')
    setIsAdding(false)
  }

  return (
    <section className="column">
      <h2 className="column-title">{title}</h2>
      <div className="column-cards">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onUpdate={onUpdateCard}
            onDelete={onDeleteCard}
          />
        ))}
      </div>
      {isAdding ? (
        <div className="column-add-form">
          <input
            className="column-add-title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Card title"
            autoFocus
          />
          <textarea
            className="column-add-description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
          />
          <div className="column-add-actions">
            <button className="column-add-submit" onClick={handleAdd}>Add</button>
            <button className="column-add-cancel" onClick={handleCancelAdd}>Cancel</button>
          </div>
        </div>
      ) : (
        <button className="column-add-btn" onClick={() => setIsAdding(true)}>
          + Add a card
        </button>
      )}
    </section>
  )
}

export default Column
