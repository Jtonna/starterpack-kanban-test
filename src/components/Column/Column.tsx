import type { Column } from '../../types'
import './Column.css'

interface ColumnProps {
  column: Column;
}

function Column({ column }: ColumnProps) {
  return (
    <div className="column">
      <h2 className="column-title">{column.title}</h2>
      <div className="column-content">
      </div>
    </div>
  )
}

export default Column
