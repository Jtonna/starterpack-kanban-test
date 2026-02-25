import type { Column, Card } from './types'
import Board from './components/Board/Board'
import useLocalStorage from './hooks/useLocalStorage'
import './App.css'

const defaultColumns: Column[] = [
  { id: 'todo', title: 'Todo', order: 0 },
  { id: 'in-progress', title: 'In Progress', order: 1 },
  { id: 'done', title: 'Done', order: 2 },
]

function App() {
  const [columns, setColumns] = useLocalStorage<Column[]>('kanban-columns', defaultColumns)
  const [cards, setCards] = useLocalStorage<Card[]>('kanban-cards', [])

  const addCard = (columnId: string, title: string, description?: string) => {
    const cardsInColumn = cards.filter(card => card.columnId === columnId)
    const maxOrder = cardsInColumn.length > 0
      ? Math.max(...cardsInColumn.map(card => card.order))
      : -1

    const newCard: Card = {
      id: crypto.randomUUID(),
      title,
      description,
      columnId,
      order: maxOrder + 1,
    }

    setCards([...cards, newCard])
  }

  const updateCard = (cardId: string, updates: Partial<Pick<Card, 'title' | 'description'>>) => {
    setCards(cards.map(card =>
      card.id === cardId ? { ...card, ...updates } : card
    ))
  }

  const deleteCard = (cardId: string) => {
    const cardToDelete = cards.find(card => card.id === cardId)
    if (!cardToDelete) return

    const remainingCards = cards.filter(card => card.id !== cardId)

    const reorderedCards = remainingCards.map(card => {
      if (card.columnId === cardToDelete.columnId && card.order > cardToDelete.order) {
        return { ...card, order: card.order - 1 }
      }
      return card
    })

    setCards(reorderedCards)
  }

  const moveCard = (cardId: string, targetColumnId: string, newOrder: number) => {
    const card = cards.find(c => c.id === cardId)
    if (!card) return

    const sourceColumnId = card.columnId

    // Update the card's columnId and order
    const updatedCards = cards.map(c => {
      if (c.id === cardId) {
        return { ...c, columnId: targetColumnId, order: newOrder }
      }
      return c
    })

    // Re-index orders in source column (if different from target)
    let reorderedCards = updatedCards
    if (sourceColumnId !== targetColumnId) {
      reorderedCards = updatedCards.map(c => {
        if (c.id !== cardId && c.columnId === sourceColumnId && c.order > card.order) {
          return { ...c, order: c.order - 1 }
        }
        return c
      })
    }

    // Re-index orders in target column to make room for the moved card
    reorderedCards = reorderedCards.map(c => {
      if (c.id !== cardId && c.columnId === targetColumnId && c.order >= newOrder) {
        return { ...c, order: c.order + 1 }
      }
      return c
    })

    setCards(reorderedCards)
  }

  const reorderColumns = (activeId: string, overId: string) => {
    const activeIndex = columns.findIndex(col => col.id === activeId)
    const overIndex = columns.findIndex(col => col.id === overId)

    if (activeIndex === -1 || overIndex === -1) return

    const newColumns = [...columns]
    const [movedColumn] = newColumns.splice(activeIndex, 1)
    newColumns.splice(overIndex, 0, movedColumn)

    // Update order fields
    const reorderedColumns = newColumns.map((col, index) => ({
      ...col,
      order: index
    }))

    setColumns(reorderedColumns)
  }

  return (
    <div className="app">
      <h1 className="app-title">Kanban Board</h1>
      <Board
        columns={columns}
        cards={cards}
        onAddCard={addCard}
        onUpdateCard={updateCard}
        onDeleteCard={deleteCard}
        onMoveCard={moveCard}
        onReorderColumns={reorderColumns}
      />
    </div>
  )
}

export default App
