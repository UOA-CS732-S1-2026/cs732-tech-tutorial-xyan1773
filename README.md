# Study Analytics Dashboard with SvelteKit

A full-stack study analytics web application built with `Svelte 5`, `SvelteKit 2`, `TypeScript`, and `SQLite`.

This project allows users to:

- register and log in
- create, edit, delete, and complete study records
- track study duration, subjects, dates, and notes
- filter and search study tasks
- view dashboard summaries
- analyse progress with charts

## Features

- User registration and login
- Cookie-based session authentication
- SQLite database persistence
- Study record CRUD operations
- Completion tracking
- Search and filter controls
- Dashboard summary cards
- Analytics charts
- Responsive multi-page interface
- Toast feedback and enhanced form submission

## Tech Stack

- Svelte 5
- SvelteKit 2
- TypeScript
- better-sqlite3
- Custom CSS

## Getting the Project

You can get the project in either of these ways.

### Option 1. Clone the repository

```bash
git clone https://github.com/UOA-CS732-S1-2026/cs732-tech-tutorial-xyan1773.git
cd tutorial_tech
```

### Option 2. Download ZIP

1. Open the GitHub repository page.
2. Click `Code`.
3. Click `Download ZIP`.
4. Extract the ZIP file.
5. Open the extracted project folder in a terminal.

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Open the app in your browser

Usually:

```text
http://localhost:5173
```

### 4. Register a new account

Open:

```text
/auth/register
```

After registering, the app will automatically create sample study records for that user.

## Build and Validation

Run these commands to verify the project:

```bash
npm run check
npm run lint
npm run build
```

## Project Structure

```text
src/
  lib/
    assets/        static app assets
    components/    reusable UI components
    server/        authentication, database, and data logic
    utils/         analytics and formatting helpers
    types.ts       shared TypeScript types
  routes/
    auth/          login, register, logout
    dashboard/     dashboard page
    records/       list, create, and edit pages
    analytics/     analytics page
    +layout.*      shared layout
    +page.svelte   home page
data/
  study-analytics.db

```

## Data Storage

The project uses a lightweight local SQLite database:

```text
data/study-analytics.db
```

This database stores:

- users
- sessions
- study records

The file is created automatically when the application runs.

## Files You Can Customize

If you want to adapt this project for your own version, these are the main files to edit:

- `src/routes/+page.svelte` for the landing page
- `src/routes/dashboard/+page.svelte` for dashboard content
- `src/routes/analytics/+page.svelte` for analytics wording and chart layout
- `src/lib/server/sample-study-records.ts` for seed/sample data
- `src/app.css` for colours, spacing, and overall visual design
- `README.md` for repository documentation

If you want to rename the app or change branding, also update:

- `src/routes/+layout.svelte`
- `src/lib/components/Sidebar.svelte`
- `src/lib/components/AppHeader.svelte`

## Frontend Summary

The frontend includes:

- a multi-page SvelteKit interface
- sidebar navigation
- dashboard summary cards
- study record management views
- analytics charts
- search and filter UI
- form validation and toast feedback

## Backend Summary

The backend includes:

- registration and login handling
- cookie-based session management
- protected routes
- server-side data loading
- study record validation
- CRUD operations
- SQLite persistence



