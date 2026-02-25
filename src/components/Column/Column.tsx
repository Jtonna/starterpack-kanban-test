import type { Column, Card } from '../../types'
import './Column.css'

interface ColumnProps {
  column: Column;
  cards: Card[];
  onAddCard: (columnId: string, title: string, description?: string) => void;
  onUpdateCard: (cardId: string, updates: Partial<Pick<Card, 'title' | 'description'>>) => void;
  onDeleteCard: (cardId: string) => void;
}

function Column({ column, cards, onAddCard, onUpdateCard, onDeleteCard }: ColumnProps) {
  return (
    <div className="column">
      <h2 className="column-title">{column.title}</h2>
      <div className="column-content">
      </div>
    </div>
  )
}

export default Column
