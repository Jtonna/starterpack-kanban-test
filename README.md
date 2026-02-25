# kanban-board

A drag-and-drop kanban board with localStorage persistence, built with React and TypeScript.

## Features

- **3-column board:** Todo, In Progress, Done
- **Card management:** Create cards with required title and optional description, edit, and delete
- **Drag-and-drop:** Move cards between and within columns, reorder columns
- **Keyboard accessible:** Full keyboard support for drag-and-drop operations
- **Persistent state:** All data saved to localStorage and survives page reloads

## Prerequisites

- Node.js (v18 or higher recommended)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to the URL shown in the terminal

## Available Scripts

- `npm run dev` — Start the Vite development server with HMR
- `npm run build` — Type-check with TypeScript and build for production
- `npm run preview` — Preview the production build locally

## Tech Stack

- **Vite** — Fast build tool and dev server
- **React 19** — UI library
- **TypeScript** — Type-safe JavaScript
- **@dnd-kit** — Accessible drag-and-drop library for React

## Architecture

- **useLocalStorage hook** — Custom hook for automatic localStorage synchronization
