import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Column as ColumnType, Card as CardType } from './types'
import Card from './Card'
import './Column.css'

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
  onAddCard: (title: string, description: string) => void;
  onUpdateCard: (cardId: string, title: string, description: string) => void;
  onDeleteCard: (cardId: string) => void;
}

function Column({ column, cards, onAddCard, onUpdateCard, onDeleteCard }: ColumnProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id, data: { type: 'column' } })

  const { setNodeRef: setDroppableRef } = useDroppable({ id: column.id + '-cards' })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  }

  const handleAdd = () => {
    const trimmed = newTitle.trim()
    if (!trimmed) return
    onAddCard(trimmed, newDescription.trim())
    setNewTitle('')
    setNewDescription('')
    setIsAdding(false)
  }

  const handleCancel = () => {
    setNewTitle('')
    setNewDescription('')
    setIsAdding(false)
  }

  return (
    <div className="column" ref={setSortableRef} style={style} {...attributes}>
      <h2 className="column-header" {...listeners}>{column.title}</h2>
      <div className="column-cards" ref={setDroppableRef}>
        <SortableContext items={column.cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onUpdate={onUpdateCard}
              onDelete={() => onDeleteCard(card.id)}
            />
          ))}
        </SortableContext>
      </div>
      {isAdding ? (
        <div className="add-card-form">
          <input
            className="add-card-title"
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Card title"
            autoFocus
          />
          <textarea
            className="add-card-description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
          />
          <div className="add-card-actions">
            <button className="btn btn-save" onClick={handleAdd}>Add</button>
            <button className="btn btn-cancel" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <button className="add-card-btn" onClick={() => setIsAdding(true)}>
          + Add a card
        </button>
      )}
    </div>
  )
}

export default Column
