# Task Manager

A pet project for managing tasks, built with **Node.js** and **Angular**.

## Tech Stack

### Backend

- **Node.js** - Server-side runtime
- **NestJS** - Progressive Node.js framework

### Frontend

- **Angular** - Frontend framework
- **TypeScript** - Programming language
- **NgRx** - State management

## Project Structure

```
task-manager/
├── backend/          # Node.js backend API
└── frontend/         # Angular frontend
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (a database named `taskmanagement` by default)

### Installation

#### Backend

```bash
cd backend
npm install
```

Create a `.env` file from the template and fill in your values:

```bash
cp .env.example .env
```

| Variable         | Description                          |
| ---------------- | ------------------------------------ |
| `DB_HOST`        | PostgreSQL host (default `localhost`) |
| `DB_PORT`        | PostgreSQL port (default `5432`)      |
| `DB_USERNAME`    | Database user                         |
| `DB_PASSWORD`    | Database password                     |
| `DB_NAME`        | Database name                         |
| `SESSION_SECRET` | Secret used to sign the session cookie (required) |

Then start the dev server:

```bash
npm run start:dev
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

## Features

- Create, read, update, and delete tasks
- Responsive UI
- State management with NgRx

## License

This is a personal learning project.
