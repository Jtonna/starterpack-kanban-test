import type { Card as CardType } from '../../types'
import './Card.css'

interface CardProps {
  card: CardType;
  onDelete: (cardId: string) => void;
  onEdit: (cardId: string) => void;
}

function Card({ card, onDelete, onEdit }: CardProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{card.title}</h3>
        <div className="card-actions">
          <button className="card-action-btn" onClick={() => onEdit(card.id)} title="Edit">✎</button>
          <button className="card-action-btn card-delete-btn" onClick={() => onDelete(card.id)} title="Delete">×</button>
        </div>
      </div>
      {card.description && <p className="card-description">{card.description}</p>}
    </div>
  )
}

export default Card
