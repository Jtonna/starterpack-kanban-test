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
import type { Column as ColumnType, Card } from './types'
import ColumnComponent from './Column'
import CardComponent from './Card'
import './Board.css'

interface BoardProps {
  columns: ColumnType[];
  cards: Record<string, Card>;
  onAddCard: (columnId: string, title: string, description: string) => void;
  onUpdateCard: (cardId: string, title: string, description: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
  onMoveCard: (cardId: string, fromColumnId: string, toColumnId: string, newIndex: number) => void;
}

function findColumnByCardId(columns: ColumnType[], cardId: string): string | undefined {
  return columns.find((col) => col.cardIds.includes(cardId))?.id
}

function Board({ columns, cards, onAddCard, onUpdateCard, onDeleteCard, onMoveCard }: BoardProps) {
  const [activeCardId, setActiveCardId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveCardId(active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeColumnId = findColumnByCardId(columns, activeId)
    if (!activeColumnId) return

    // overId could be a column id (empty column) or a card id
    let overColumnId = findColumnByCardId(columns, overId)
    if (!overColumnId) {
      // Check if overId is a column id
      const isColumn = columns.some((col) => col.id === overId)
      if (isColumn) {
        overColumnId = overId
      } else {
        return
      }
    }

    // Only handle cross-column moves here
    if (activeColumnId === overColumnId) return

    // Determine the new index in the target column
    const overColumn = columns.find((col) => col.id === overColumnId)
    if (!overColumn) return

    let newIndex: number
    const overCardIndex = overColumn.cardIds.indexOf(overId)
    if (overCardIndex >= 0) {
      newIndex = overCardIndex
    } else {
      // Dropping onto empty column or column itself
      newIndex = overColumn.cardIds.length
    }

    onMoveCard(activeId, activeColumnId, overColumnId, newIndex)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over) {
      const activeId = active.id as string
      const overId = over.id as string

      const activeColumnId = findColumnByCardId(columns, activeId)
      const overColumnId = findColumnByCardId(columns, overId)

      // Same-column reorder
      if (activeColumnId && overColumnId && activeColumnId === overColumnId) {
        const column = columns.find((col) => col.id === activeColumnId)
        if (column) {
          const oldIndex = column.cardIds.indexOf(activeId)
          const newIndex = column.cardIds.indexOf(overId)
          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            onMoveCard(activeId, activeColumnId, activeColumnId, newIndex)
          }
        }
      }
    }

    setActiveCardId(null)
  }

  const activeCard = activeCardId ? cards[activeCardId] : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="board">
        {columns.map((column) => {
          const columnCards = column.cardIds
            .map((id) => cards[id])
            .filter((c): c is Card => c !== undefined)
          return (
            <ColumnComponent
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
      <DragOverlay>
        {activeCard ? (
          <CardComponent
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
