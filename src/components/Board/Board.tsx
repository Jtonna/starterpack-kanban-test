import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import type { ColumnData, CardData } from '../../types/board'
import Column from '../Column/Column'
import Card from '../Card/Card'
import './Board.css'

const DEFAULT_COLUMNS: ColumnData[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
]

function Board() {
  const [cards, setCards] = useState<CardData[]>([])
  const [columns, setColumns] = useState<ColumnData[]>(DEFAULT_COLUMNS)
  const [activeCard, setActiveCard] = useState<CardData | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  function handleAddCard(columnId: string, title: string, description?: string) {
    const newCard: CardData = {
      id: crypto.randomUUID(),
      title,
      description,
      columnId,
    }
    setCards((prev) => [...prev, newCard])
  }

  function handleUpdateCard(cardId: string, title: string, description?: string) {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, title, description } : card
      )
    )
  }

  function handleDeleteCard(cardId: string) {
    setCards((prev) => prev.filter((card) => card.id !== cardId))
  }

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'card') {
      setActiveCard(event.active.data.current.card)
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeData = active.data.current
    const overData = over.data.current

    if (activeData?.type !== 'card') return

    const activeCardId = active.id as string

    // Determine the column the "over" target belongs to
    let overColumnId: string
    if (overData?.type === 'card') {
      overColumnId = overData.card.columnId
    } else if (overData?.type === 'column') {
      overColumnId = over.id as string
    } else {
      return
    }

    setCards((prev) => {
      const activeIndex = prev.findIndex((c) => c.id === activeCardId)
      if (activeIndex === -1) return prev

      const activeCard = prev[activeIndex]
      if (!activeCard) return prev

      // If moving to a different column
      if (activeCard.columnId !== overColumnId) {
        const updatedCards = prev.filter((c) => c.id !== activeCardId)
        const updatedCard = { ...activeCard, columnId: overColumnId }

        if (overData?.type === 'card') {
          const overIndex = updatedCards.findIndex((c) => c.id === over.id)
          updatedCards.splice(overIndex, 0, updatedCard)
        } else {
          updatedCards.push(updatedCard)
        }
        return updatedCards
      }

      // Same column reorder
      if (overData?.type === 'card' && activeCardId !== over.id) {
        const overIndex = prev.findIndex((c) => c.id === over.id)
        return arrayMove(prev, activeIndex, overIndex)
      }

      return prev
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="board">
        {columns.map((col) => (
          <Column
            key={col.id}
            columnId={col.id}
            title={col.title}
            cards={cards.filter((c) => c.columnId === col.id)}
            onAddCard={handleAddCard}
            onUpdateCard={handleUpdateCard}
            onDeleteCard={handleDeleteCard}
          />
        ))}
      </div>
      <DragOverlay>
        {activeCard ? (
          <Card
            card={activeCard}
            onUpdate={() => {}}
            onDelete={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default Board
