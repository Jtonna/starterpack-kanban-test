import { useState } from 'react'
import type { Column as ColumnType, Card } from '../../types'
import {
  DndContext,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import Column from '../Column/Column'
import CardComponent from '../Card/Card'
import './Board.css'

interface BoardProps {
  columns: ColumnType[];
  cards: Card[];
  onAddCard: (columnId: string, title: string, description?: string) => void;
  onUpdateCard: (cardId: string, updates: Partial<Pick<Card, 'title' | 'description'>>) => void;
  onDeleteCard: (cardId: string) => void;
  onMoveCard: (cardId: string, targetColumnId: string, newOrder: number) => void;
  onReorderColumns: (activeId: string, overId: string) => void;
}

function Board({ columns, cards, onAddCard, onUpdateCard, onDeleteCard, onMoveCard, onReorderColumns }: BoardProps) {
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order)
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null)
  const [activeCard, setActiveCard] = useState<Card | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    if (active.data.current?.type === 'column') {
      const column = sortedColumns.find(col => col.id === active.id)
      setActiveColumn(column || null)
    } else if (active.data.current?.type === 'card') {
      setActiveCard(active.data.current.card)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over || active.data.current?.type !== 'card') return

    const activeCard = active.data.current.card as Card
    const overId = over.id as string

    // Check if dragging over a column (empty column case)
    if (over.data.current?.type === 'column') {
      const targetColumnId = overId
      if (activeCard.columnId !== targetColumnId) {
        // Move to the end of the target column
        const cardsInTargetColumn = cards.filter(c => c.columnId === targetColumnId)
        const newOrder = cardsInTargetColumn.length
        onMoveCard(activeCard.id, targetColumnId, newOrder)
      }
      return
    }

    // Check if dragging over another card
    if (over.data.current?.type === 'card') {
      const overCard = over.data.current.card as Card
      const targetColumnId = overCard.columnId

      if (activeCard.id === overCard.id) return

      // Calculate the new order based on the over card's position
      if (activeCard.columnId === targetColumnId) {
        // Same column - just reorder
        const cardsInColumn = cards
          .filter(c => c.columnId === targetColumnId && c.id !== activeCard.id)
          .sort((a, b) => a.order - b.order)

        const overIndex = cardsInColumn.findIndex(c => c.id === overCard.id)
        const newOrder = overIndex >= 0 ? cardsInColumn[overIndex].order : 0

        if (activeCard.order !== newOrder) {
          onMoveCard(activeCard.id, targetColumnId, newOrder)
        }
      } else {
        // Different column - move to the position of the over card
        onMoveCard(activeCard.id, targetColumnId, overCard.order)
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      setActiveColumn(null)
      setActiveCard(null)
      return
    }

    if (active.data.current?.type === 'column' && over.data.current?.type === 'column') {
      onReorderColumns(active.id as string, over.id as string)
    }

    setActiveColumn(null)
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
        <SortableContext items={sortedColumns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
          {sortedColumns.map(column => {
            const columnCards = cards.filter(card => card.columnId === column.id)
            return (
              <Column
                key={column.id}
                column={column}
                cards={columnCards}
                onAddCard={onAddCard}
                onUpdateCard={onUpdateCard}
                onDeleteCard={onDeleteCard}
              />
            )
          })}
        </SortableContext>
      </div>
      <DragOverlay>
        {activeColumn ? (
          <div className="column" style={{ opacity: 0.9, cursor: 'grabbing' }}>
            <h2 className="column-title">{activeColumn.title}</h2>
          </div>
        ) : activeCard ? (
          <CardComponent card={activeCard} onDelete={() => {}} onUpdate={() => {}} />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default Board
