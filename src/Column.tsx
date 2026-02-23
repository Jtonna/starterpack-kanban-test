import type { Column as ColumnType } from './types'
import './Column.css'

interface ColumnProps {
  column: ColumnType;
}

function Column({ column }: ColumnProps) {
  return (
    <div className="column">
      <h2 className="column-header">{column.title}</h2>
      <div className="column-cards" />
    </div>
  )
}

export default Column
