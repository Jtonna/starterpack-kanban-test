# Kanban Board

A single-board kanban application built to validate the [starterpack](https://github.com/Jtonna/starterpack) orchestrator workflow end-to-end.

## Features

- **Board with columns**: Three default columns — Todo, In Progress, Done
- **Card management**: Create, edit, and delete cards with title and optional description
- **Drag and drop**: Drag cards between columns and reorder within columns
- **Column reordering**: Drag columns by their header to rearrange
- **Persistence**: All board state saved to localStorage — survives page reloads

## Tech Stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) (dev server + build)
- [@dnd-kit](https://dndkit.com/) (drag and drop)
- Plain CSS (no framework)
- localStorage (no backend)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview   # preview the production build
```

## Documentation

See [docs/INDEX.md](docs/INDEX.md) for the full documentation index.
