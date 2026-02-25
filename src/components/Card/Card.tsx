import { useState } from 'react'
import type { Card as CardType } from '../../types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CardForm from '../CardForm/CardForm'
import './Card.css'

interface CardProps {
  card: CardType;
  onDelete: (cardId: string) => void;
  onUpdate: (cardId: string, updates: Partial<Pick<CardType, 'title' | 'description'>>) => void;
}

function Card({ card, onDelete, onUpdate }: CardProps) {
  const [isEditing, setIsEditing] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      card,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const handleEditSave = (title: string, description?: string) => {
    onUpdate(card.id, { title, description })
    setIsEditing(false)
  }

  const handleEditCancel = () => {
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <CardForm
        initialTitle={card.title}
        initialDescription={card.description}
        onSave={handleEditSave}
        onCancel={handleEditCancel}
      />
    )
  }

  return (
    <div ref={setNodeRef} style={style} className="card" {...attributes} {...listeners}>
      <div className="card-header">
        <h3 className="card-title">{card.title}</h3>
        <div className="card-actions">
          <button className="card-action-btn" onClick={() => setIsEditing(true)} title="Edit">✎</button>
          <button className="card-action-btn card-delete-btn" onClick={() => onDelete(card.id)} title="Delete">×</button>
        </div>
      </div>
      {card.description && <p className="card-description">{card.description}</p>}
    </div>
  )
}

export default Card
