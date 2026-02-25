export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  order: number;
}
