# Kanban App Spec

A simple kanban board app used to validate the [starterpack](https://github.com/Jtonna/starterpack) orchestrator workflow end-to-end.

## Features

### Board
- Single board view on load
- Three default columns: Todo, In Progress, Done
- Columns are reorderable via drag-and-drop

### Cards
- Each card has a title (required) and description (optional)
- Cards can be created, edited, and deleted
- Cards are draggable between columns
- Cards maintain their order within a column

### Persistence
- All board state (columns, cards, ordering) persists across page reloads
- localStorage or a local JSON file is fine - no backend required

## Out of Scope
- User authentication
- Multiple boards
- Real-time collaboration
- Backend / database
- Card labels, due dates, assignees, or other metadata

## Notes
- The tech stack is intentionally unspecified. The orchestrator's planning workflow should evaluate the codebase (empty) and decide what fits.
- This is a workflow validation project, not a product. The goal is to exercise every phase of the starterpack (planning, implementation, docs, PR) at least once.
