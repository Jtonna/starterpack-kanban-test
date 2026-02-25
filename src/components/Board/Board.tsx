import { useState, useEffect } from 'react'
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

const STORAGE_KEY_COLUMNS = 'kanban-columns'
const STORAGE_KEY_CARDS = 'kanban-cards'

function loadFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function Board() {
  const [cards, setCards] = useState<CardData[]>(() => loadFromStorage<CardData[]>(STORAGE_KEY_CARDS) ?? [])
  const [columns, setColumns] = useState<ColumnData[]>(() => loadFromStorage<ColumnData[]>(STORAGE_KEY_COLUMNS) ?? DEFAULT_COLUMNS)
  const [activeCard, setActiveCard] = useState<CardData | null>(null)
  const [activeColumn, setActiveColumn] = useState<ColumnData | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(cards))
    } catch {
      // localStorage unavailable or full
    }
  }, [cards])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COLUMNS, JSON.stringify(columns))
    } catch {
      // localStorage unavailable or full
    }
  }, [columns])

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
    const activeData = event.active.data.current
    if (activeData?.type === 'card') {
      setActiveCard(activeData.card)
    } else if (activeData?.type === 'column') {
      const column = columns.find(col => col.id === event.active.id)
      if (column) {
        setActiveColumn(column)
      }
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
    const { active, over } = event

    // Handle column reordering
    if (active.data.current?.type === 'column' && over) {
      const activeIndex = columns.findIndex((col) => col.id === active.id)
      const overIndex = columns.findIndex((col) => col.id === over.id)

      if (activeIndex !== overIndex) {
        setColumns(arrayMove(columns, activeIndex, overIndex))
      }
    }

    setActiveCard(null)
    setActiveColumn(null)
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
        <SortableContext items={columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
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
        </SortableContext>
      </div>
      <DragOverlay>
        {activeCard ? (
          <Card
            card={activeCard}
            onUpdate={() => {}}
            onDelete={() => {}}
          />
        ) : null}
        {activeColumn ? (
          <Column
            columnId={activeColumn.id}
            title={activeColumn.title}
            cards={cards.filter((c) => c.columnId === activeColumn.id)}
            onAddCard={() => {}}
            onUpdateCard={() => {}}
            onDeleteCard={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default Board
