import type { Column as ColumnType, Card } from './types'
import Column from './Column'
import './Board.css'

interface BoardProps {
  columns: ColumnType[];
  cards: Record<string, Card>;
  onAddCard: (columnId: string, title: string, description: string) => void;
  onUpdateCard: (cardId: string, title: string, description: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
}

function Board({ columns, cards, onAddCard, onUpdateCard, onDeleteCard }: BoardProps) {
  return (
    <div className="board">
      {columns.map((column) => {
        const columnCards = column.cardIds
          .map((id) => cards[id])
          .filter((c): c is Card => c !== undefined)
        return (
          <Column
            key={column.id}
            column={column}
            cards={columnCards}
            onAddCard={(title, description) => onAddCard(column.id, title, description)}
            onUpdateCard={onUpdateCard}
            onDeleteCard={(cardId) => onDeleteCard(column.id, cardId)}
          />
        )
      })}
    </div>
  )
}

export default Board
