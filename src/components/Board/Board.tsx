import type { Column as ColumnType, Card } from '../../types'
import Column from '../Column/Column'
import './Board.css'

interface BoardProps {
  columns: ColumnType[];
  cards: Card[];
  onAddCard: (columnId: string, title: string, description?: string) => void;
  onUpdateCard: (cardId: string, updates: Partial<Pick<Card, 'title' | 'description'>>) => void;
  onDeleteCard: (cardId: string) => void;
  onMoveCard: (cardId: string, targetColumnId: string, newOrder: number) => void;
  onReorderColumns: (activeId: string, overId: string) => void;
}

function Board({ columns, cards, onAddCard, onUpdateCard, onDeleteCard, onMoveCard, onReorderColumns }: BoardProps) {
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order)

  return (
    <div className="board">
      {sortedColumns.map(column => {
        const columnCards = cards.filter(card => card.columnId === column.id)
        return (
          <Column
            key={column.id}
            column={column}
            cards={columnCards}
            onAddCard={onAddCard}
            onUpdateCard={onUpdateCard}
            onDeleteCard={onDeleteCard}
          />
        )
      })}
    </div>
  )
}

export default Board
