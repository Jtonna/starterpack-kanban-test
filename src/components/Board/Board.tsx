import type { Column as ColumnType } from '../../types'
import Column from '../Column/Column'
import './Board.css'

interface BoardProps {
  columns: ColumnType[];
}

function Board({ columns }: BoardProps) {
  return (
    <div className="board">
      {columns.map(column => (
        <Column key={column.id} column={column} />
      ))}
    </div>
  )
}

export default Board
