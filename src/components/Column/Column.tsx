import type { Column, Card as CardType } from '../../types'
import Card from '../Card/Card'
import './Column.css'

interface ColumnProps {
  column: Column;
  cards: CardType[];
  onAddCard: (columnId: string, title: string, description?: string) => void;
  onUpdateCard: (cardId: string, updates: Partial<Pick<CardType, 'title' | 'description'>>) => void;
  onDeleteCard: (cardId: string) => void;
}

function Column({ column, cards, onAddCard, onUpdateCard, onDeleteCard }: ColumnProps) {
  const sortedCards = [...cards].sort((a, b) => a.order - b.order)

  const handleEdit = (cardId: string) => {
    // Placeholder for sub-task 3
  }

  return (
    <div className="column">
      <h2 className="column-title">{column.title}</h2>
      <div className="column-content">
        {sortedCards.map(card => (
          <Card
            key={card.id}
            card={card}
            onDelete={onDeleteCard}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  )
}

export default Column
