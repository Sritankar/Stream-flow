# Stream Flow (VidFlow)

A mobile-first video browsing and playback web app built with React, TypeScript, and Vite.

## Overview

Stream Flow provides a short-form video feed experience with category filtering, search, and an overlay player with mini-player support.

## Features

- Browse videos by category (Nature, Technology, Music, Travel, Education).
- Search videos by title or creator.
- Add custom videos from the UI (title, URL, thumbnail, creator, description, category, duration).
- Open videos in a full-screen overlay player.
- Playback controls: play/pause, seek, skip +/-10s, volume, fullscreen, and Picture-in-Picture (when supported).
- Minimize the player to a bottom mini-player and restore it.
- Auto-play next related video with a short countdown and cancel option.
- View related videos by category from the player.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui (Radix-based components)
- Framer Motion
- React Router
- Vitest + Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install and Run

```sh
npm install
npm run dev
```

The dev server runs on `http://localhost:8080`.

## Available Scripts

- `npm run dev` - Start development server.
- `npm run build` - Build production bundle.
- `npm run build:dev` - Build with development mode.
- `npm run preview` - Preview the production build locally.
- `npm run lint` - Run ESLint.
- `npm run test` - Run tests once with Vitest.
- `npm run test:watch` - Run Vitest in watch mode.

## Project Structure

```text
src/
  components/
    AddVideoDialog.tsx      # Dialog form to add user videos
    VideoCard.tsx           # Video cards for feed and related list
    VideoControls.tsx       # Overlay player controls
    VideoPlayerOverlay.tsx  # Full player + mini-player + related videos
  context/
    PlayerContext.tsx       # Global player state and actions
  data/
    videos.ts               # Seed video catalog, categories, helpers
  pages/
    Index.tsx               # Main feed: search, categories, grouped sections
    NotFound.tsx            # 404 route
  test/
    example.test.ts         # Starter test
    setup.ts                # Test setup (jest-dom, matchMedia)
```

## Data Notes

- Default videos come from `src/data/videos.ts` and use public sample media URLs.
- Videos added through the "Add Video" dialog are kept in client state only.
- Added videos are not persisted after a page refresh.

## Routing

- `/` - Main video feed.
- `*` - Not found page.

## Development Notes

- Path alias `@` maps to `src`.
- Styling tokens and theme variables are defined in `src/index.css` and `tailwind.config.ts`.
