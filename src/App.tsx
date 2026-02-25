import { useState } from 'react'
import type { Column } from './types'
import Board from './components/Board/Board'
import './App.css'

const defaultColumns: Column[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
]

function App() {
  const [columns] = useState<Column[]>(defaultColumns)

  return (
    <div className="app">
      <h1 className="app-title">Kanban Board</h1>
      <Board columns={columns} />
    </div>
  )
}

export default App
