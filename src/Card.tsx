import { useState } from 'react'
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
      <div className="card card-editing">
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
    <div className="card">
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
