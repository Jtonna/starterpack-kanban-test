# Architecture

## Overview

A client-side single-page application (SPA) with no backend. All state lives in React component state and persists to localStorage.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Language | TypeScript (strict mode) |
| Build | Vite 6 |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Styling | Plain CSS (one file per component) |
| Persistence | localStorage |

## Component Hierarchy

```
App (src/App.tsx)
├── State: columns[], cards{}
├── Handlers: addCard, updateCard, deleteCard, moveCard, moveColumn
│
└── Board (src/Board.tsx)
    ├── DndContext (sensors, collision detection, drag handlers)
    ├── SortableContext (horizontal — column ordering)
    ├── DragOverlay (ghost card or ghost column)
    │
    └── Column (src/Column.tsx) × N
        ├── useSortable (column reordering, drag handle on header)
        ├── useDroppable (card drop target)
        ├── SortableContext (vertical — card ordering)
        ├── Add-card form (local state)
        │
        └── Card (src/Card.tsx) × M
            ├── useSortable (card dragging)
            ├── Display mode (title, description, edit/delete)
            └── Edit mode (inline form, save/cancel)
```

## State Model

### Types (`src/types.ts`)

```typescript
interface Column {
  id: string;        // stable string ID (e.g. 'col-todo')
  title: string;     // display name
  cardIds: string[]; // ordered list of card IDs
}

interface Card {
  id: string;        // generated via crypto.randomUUID()
  title: string;     // required
  description: string; // may be empty string
}
```

### App State (`src/App.tsx`)

- `columns: Column[]` — ordered array, source of truth for column order and card membership
- `cards: Record<string, Card>` — flat lookup map keyed by card ID

### Persistence (`src/storage.ts`)

- **Key**: `kanban-board-state`
- **Shape**: `{ columns: Column[], cards: Record<string, Card> }`
- **Save**: `useEffect` on every `[columns, cards]` change
- **Load**: lazy `useState` initializer on mount, falls back to defaults if missing/corrupt

## Drag and Drop Design

Both card and column dragging share a single `DndContext` in Board.tsx.

### Type Discrimination

Each `useSortable` call passes `data: { type: 'card' | 'column' }`. All drag event handlers branch on `active.data.current?.type` to determine behavior.

### Card Dragging

- **Within column**: resolved in `onDragEnd` — splice reorder of `cardIds`
- **Between columns**: resolved in `onDragOver` — real-time state update for live visual feedback
- **Edit mode**: drag listeners suppressed when card is in edit mode

### Column Dragging

- **Drag handle**: `{...listeners}` applied only to column header (`<h2>`)
- **Reorder**: resolved in `onDragEnd` — splice reorder of `columns` array
- **No onDragOver**: column moves are instant on drop, no mid-drag state changes

### Collision Detection

`closestCorners` — works well for both horizontal (columns) and vertical (cards) contexts.

## File Structure

```
src/
├── main.tsx        — React root, StrictMode
├── App.tsx         — Root state, CRUD handlers, persistence
├── App.css         — App shell styles
├── Board.tsx       — DndContext, drag orchestration
├── Board.css       — Flex layout, column ghost
├── Column.tsx      — Column sortable/droppable, add-card form
├── Column.css      — Column styles, drag handle cursor
├── Card.tsx        — Card sortable, display/edit modes
├── Card.css        — Card styles, drag opacity
├── types.ts        — Column and Card interfaces
├── storage.ts      — localStorage load/save
├── index.css       — Global reset
└── vite-env.d.ts   — Vite client types
```
