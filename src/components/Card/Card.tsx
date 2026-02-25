import { useState } from 'react'
import type { CardData } from '../../types/board'
import './Card.css'

interface CardProps {
  card: CardData
  onUpdate: (cardId: string, title: string, description?: string) => void
  onDelete: (cardId: string) => void
}

function Card({ card, onUpdate, onDelete }: CardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(card.title)
  const [editDescription, setEditDescription] = useState(card.description ?? '')

  function handleSave() {
    const trimmed = editTitle.trim()
    if (!trimmed) return
    onUpdate(card.id, trimmed, editDescription.trim() || undefined)
    setIsEditing(false)
  }

  function handleCancel() {
    setEditTitle(card.title)
    setEditDescription(card.description ?? '')
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="card card--editing">
        <input
          className="card-edit-title"
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
          <button className="card-save-btn" onClick={handleSave}>Save</button>
          <button className="card-cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-content">
        <h3 className="card-title">{card.title}</h3>
        {card.description && (
          <p className="card-description">{card.description}</p>
        )}
      </div>
      <div className="card-actions">
        <button className="card-edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
        <button className="card-delete-btn" onClick={() => onDelete(card.id)}>Delete</button>
      </div>
    </div>
  )
}

export default Card
