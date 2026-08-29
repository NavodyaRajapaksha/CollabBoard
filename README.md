# CollabBoard

# CollabBoard - Frontend

A static UI skeleton for the CollabBoard project - M1 milestone.

## Tech Stack
- React 18
- CSS3
- localStorage for client persistence

## Setup Instructions
1. Clone the repository
2. Navigate to the frontend folder
3. Run `npm install`
4. Run `npm start`
5. Open http://localhost:3000

## Component Architecture

# CollabBoard - React + Node/Express + MongoDB

The Frontend is connected to the MongoDB backend through REST APIs.

## Project structure

- `Frontend/` - React application
- `Backend/` - Node.js + Express API + Mongoose
- `Backend/.env.example` - backend configuration example
- `Frontend/.env.example` - frontend API URL example

## Run backend

```bash
cd Backend
npm install
```

Copy `.env.example` to `.env`, then set your MongoDB connection string and JWT secret.

```bash
npm run dev
```

Default API: `http://localhost:5000`

## Run frontend

```bash
cd Frontend
npm install
npm start
```

The frontend uses `http://localhost:5000/api` by default. You can override it with `REACT_APP_API_URL`.

## MongoDB collections

Mongoose creates these collections:

- `users`: `name`, `email`, `passwordHash`
- `tasks`: `title`, `column`, `tag`, `description`, `userId`

The frontend-compatible task object is returned as `id`, `title`, `column`, `tag`, and `description`.