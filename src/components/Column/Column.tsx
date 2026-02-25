import { useState } from 'react'
import type { CardData } from '../../types/board'
import './Column.css'

interface ColumnProps {
  columnId: string
  title: string
  cards: CardData[]
  onAddCard: (columnId: string, title: string, description?: string) => void
  onUpdateCard: (cardId: string, title: string, description?: string) => void
  onDeleteCard: (cardId: string) => void
}

function Column({ columnId, title, cards, onAddCard, onUpdateCard, onDeleteCard }: ColumnProps) {
  return (
    <section className="column">
      <h2 className="column-title">{title}</h2>
      <div className="column-cards">
        {/* Cards will be rendered here in the next sub-task */}
      </div>
    </section>
  )
}

export default Column
