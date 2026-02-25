import { useState } from 'react'
import type { Column, Card as CardType } from '../../types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Card from '../Card/Card'
import CardForm from '../CardForm/CardForm'
import './Column.css'

interface ColumnProps {
  column: Column;
  cards: CardType[];
  onAddCard: (columnId: string, title: string, description?: string) => void;
  onUpdateCard: (cardId: string, updates: Partial<Pick<CardType, 'title' | 'description'>>) => void;
  onDeleteCard: (cardId: string) => void;
}

function Column({ column, cards, onAddCard, onUpdateCard, onDeleteCard }: ColumnProps) {
  const [isAdding, setIsAdding] = useState(false)
  const sortedCards = [...cards].sort((a, b) => a.order - b.order)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleAddSave = (title: string, description?: string) => {
    onAddCard(column.id, title, description)
    setIsAdding(false)
  }

  const handleAddCancel = () => {
    setIsAdding(false)
  }

  return (
    <div ref={setNodeRef} style={style} className="column">
      <h2 className="column-title" {...attributes} {...listeners} style={{ cursor: 'grab' }}>
        {column.title}
      </h2>
      <div className="column-content">
        {sortedCards.map(card => (
          <Card
            key={card.id}
            card={card}
            onDelete={onDeleteCard}
            onUpdate={onUpdateCard}
          />
        ))}
        {isAdding && (
          <CardForm
            onSave={handleAddSave}
            onCancel={handleAddCancel}
          />
        )}
        {!isAdding && (
          <button className="add-card-btn" onClick={() => setIsAdding(true)}>
            + Add card
          </button>
        )}
      </div>
    </div>
  )
}

export default Column
