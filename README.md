# Task Manager

A pet project for managing tasks, built with **Node.js** and **Angular**.

## Tech Stack

### Backend

- **Node.js** - Server-side runtime
- **Express.js** - Web application framework

### Frontend

- **Angular** - Frontend framework
- **TypeScript** - Programming language
- **NgRx** - State management

## Project Structure

```
task-manager/
├── backend/          # Node.js backend API
│   ├── app.js        # Main application file
│   ├── controllers/  # Request handlers
│   └── routes/       # API routes
└── frontend/         # Angular frontend
    └── src/
        └── app/
            ├── core/           # Core services
            ├── features/       # Feature modules with state management
            └── task-list/      # Task list components
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

#### Backend

```bash
cd backend
npm install
npm start
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
