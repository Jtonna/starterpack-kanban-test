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
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import Column from '../Column/Column'
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
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      setActiveColumn(null)
      return
    }

    if (active.data.current?.type === 'column' && over.data.current?.type === 'column') {
      onReorderColumns(active.id as string, over.id as string)
    }

    setActiveColumn(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
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
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default Board
