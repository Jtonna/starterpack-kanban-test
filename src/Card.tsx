import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Card as CardType } from './types'
import './Card.css'

interface CardProps {
  card: CardType;
  onUpdate: (cardId: string, title: string, description: string) => void;
  onDelete: () => void;
}

function Card({ card, onUpdate, onDelete }: CardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(card.title)
  const [editDescription, setEditDescription] = useState(card.description)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  }

  const handleSave = () => {
    const trimmed = editTitle.trim()
    if (!trimmed) return
    onUpdate(card.id, trimmed, editDescription.trim())
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(card.title)
    setEditDescription(card.description)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="card card-editing" ref={setNodeRef} style={style} {...attributes}>
        <input
          className="card-edit-title"
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Card title"
          autoFocus
        />
        <textarea
          className="card-edit-description"
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={3}
        />
        <div className="card-actions">
          <button className="btn btn-save" onClick={handleSave}>Save</button>
          <button className="btn btn-cancel" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className="card" ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <h3 className="card-title">{card.title}</h3>
      {card.description && <p className="card-description">{card.description}</p>}
      <div className="card-actions">
        <button className="btn btn-edit" onClick={() => setIsEditing(true)}>Edit</button>
        <button className="btn btn-delete" onClick={onDelete}>Delete</button>
      </div>
    </div>
  )
}

export default Card
