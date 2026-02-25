import { useState } from 'react'
import './CardForm.css'

interface CardFormProps {
  initialTitle?: string;
  initialDescription?: string;
  onSave: (title: string, description?: string) => void;
  onCancel: () => void;
}

function CardForm({ initialTitle = '', initialDescription = '', onSave, onCancel }: CardFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return
    onSave(trimmedTitle, description.trim() || undefined)
  }

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <input
        className="card-form-input"
        type="text"
        placeholder="Card title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        autoFocus
        required
      />
      <textarea
        className="card-form-textarea"
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={2}
      />
      <div className="card-form-actions">
        <button type="submit" className="card-form-btn card-form-save">Save</button>
        <button type="button" className="card-form-btn card-form-cancel" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

export default CardForm
