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
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
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
  onMoveColumn: (columnId: string, newIndex: number) => void;
}

function findColumnByCardId(columns: ColumnType[], cardId: string): string | undefined {
  return columns.find((col) => col.cardIds.includes(cardId))?.id
}

function Board({ columns, cards, onAddCard, onUpdateCard, onDeleteCard, onMoveCard, onMoveColumn }: BoardProps) {
  const [activeCardId, setActiveCardId] = useState<string | null>(null)
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const type = active.data.current?.type
    if (type === 'column') {
      setActiveColumnId(active.id as string)
    } else {
      setActiveCardId(active.id as string)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    // Don't handle drag-over for column drags
    if (activeColumnId) return

    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeColId = findColumnByCardId(columns, activeId)
    if (!activeColId) return

    // overId could be a column id, a card id, or a column-cards droppable id
    let overColumnId = findColumnByCardId(columns, overId)
    if (!overColumnId) {
      const isColumn = columns.some((col) => col.id === overId)
      if (isColumn) {
        overColumnId = overId
      } else {
        // Check if it's a column-cards droppable
        const stripped = overId.endsWith('-cards') ? overId.slice(0, -6) : null
        if (stripped && columns.some((col) => col.id === stripped)) {
          overColumnId = stripped
        } else {
          return
        }
      }
    }

    // Only handle cross-column moves here
    if (activeColId === overColumnId) return

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

    onMoveCard(activeId, activeColId, overColumnId, newIndex)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (activeColumnId) {
      // Column reorder
      if (over) {
        const activeId = active.id as string
        const overId = over.id as string
        if (activeId !== overId) {
          const newIndex = columns.findIndex((col) => col.id === overId)
          if (newIndex !== -1) {
            onMoveColumn(activeId, newIndex)
          }
        }
      }
      setActiveColumnId(null)
      setActiveCardId(null)
      return
    }

    // Existing card drag end logic
    if (over) {
      const activeId = active.id as string
      const overId = over.id as string

      const fromColumnId = findColumnByCardId(columns, activeId)
      const toColumnId = findColumnByCardId(columns, overId)

      if (fromColumnId && toColumnId && fromColumnId === toColumnId) {
        const column = columns.find((col) => col.id === fromColumnId)
        if (column) {
          const oldIndex = column.cardIds.indexOf(activeId)
          const newIndex = column.cardIds.indexOf(overId)
          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            onMoveCard(activeId, fromColumnId, fromColumnId, newIndex)
          }
        }
      }
    }

    setActiveCardId(null)
  }

  const activeCard = activeCardId ? cards[activeCardId] : null
  const activeColumn = activeColumnId ? columns.find((c) => c.id === activeColumnId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={columns.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
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
      </SortableContext>
      <DragOverlay>
        {activeCard ? (
          <CardComponent
            card={activeCard}
            onUpdate={() => {}}
            onDelete={() => {}}
          />
        ) : activeColumn ? (
          <div className="column-ghost">
            <h2 className="column-header">{activeColumn.title}</h2>
            <div className="column-ghost-body">{activeColumn.cardIds.length} cards</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default Board
