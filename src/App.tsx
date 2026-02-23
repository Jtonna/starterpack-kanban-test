import type { Column } from './types'
import Board from './Board'
import './App.css'

const DEFAULT_COLUMNS: Column[] = [
  { id: 'col-todo', title: 'Todo', cardIds: [] },
  { id: 'col-inprogress', title: 'In Progress', cardIds: [] },
  { id: 'col-done', title: 'Done', cardIds: [] },
]

function App() {
  return (
    <div className="app">
      <h1>Kanban Board</h1>
      <Board columns={DEFAULT_COLUMNS} />
    </div>
  )
}

export default App
