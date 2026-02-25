import type { ColumnData } from '../../types/board'
import Column from '../Column/Column'
import './Board.css'

const DEFAULT_COLUMNS: ColumnData[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
]

function Board() {
  return (
    <div className="board">
      {DEFAULT_COLUMNS.map((col) => (
        <Column key={col.id} title={col.title} />
      ))}
    </div>
  )
}

export default Board
