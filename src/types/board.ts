export interface ColumnData {
  id: string
  title: string
}

export interface CardData {
  id: string
  title: string
  description?: string
  columnId: string
}
