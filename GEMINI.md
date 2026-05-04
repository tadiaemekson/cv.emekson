# GEMINI.md - Project Context

This file provides instructional context for Gemini CLI when working on this portfolio project.

## Project Overview

This is a full-stack personal portfolio application for **TADIA FONGE EMEKSON**. It consists of a React frontend and a Node.js backend.

- **Frontend:** Built with React 19 and Vite 8. It uses functional components and Vanilla CSS for styling.
- **Backend:** A Node.js Express server that handles contact form submissions.
- **Data Persistence:** Messages from the contact form are stored in a local JSON file: `backend/data/messages.json`.
- **Portfolio Data:** The core content of the portfolio (profile, skills, projects, education, contact info) is centralized in `src/data/portfolio.js`.

## Architecture & Integration

- **API Proxy:** The Vite development server is configured to proxy requests starting with `/api` to the backend server running at `http://localhost:5000`.
- **Theme Management:** Supports dark and light modes using a `data-theme` attribute on the `<body>` element, managed in `App.jsx`.
- **Admin Section:** A simple admin view is accessible at the `/admin` path (handled via conditional rendering in `App.jsx`) to view messages received via the contact form.

## Key Files & Directories

- `src/data/portfolio.js`: The "Source of Truth" for portfolio content.
- `src/App.jsx`: Main entry point for the frontend, handles routing and theme.
- `src/components/`: Reusable React components (Hero, About, Projects, etc.).
- `backend/server.js`: Express server implementation.
- `backend/data/messages.json`: Storage for contact messages.
- `vite.config.js`: Vite configuration including the API proxy.

## Building and Running

### Prerequisites
- Node.js installed.

### Development Commands
- `npm install`: Install dependencies for both frontend and backend (root `package.json`).
- `npm run dev`: Start the Vite frontend development server (default: `http://localhost:5173`).
- `npm run dev:server`: Start the Express backend development server (default: `http://localhost:5000`).
- `npm run lint`: Run ESLint to check for code quality issues.

### Production Commands
- `npm run build`: Build the frontend for production (output in `dist/`).
- `npm run start:server`: Start the Express backend.

## Development Conventions

- **State Management:** Uses React `useState` and `useEffect` hooks. No external state management library is used.
- **Styling:** Vanilla CSS with a focus on responsiveness. Global styles in `index.css` and component-specific styles in `App.css`.
- **API Communication:** Uses the native `fetch` API for communicating with the backend.
- **Component Structure:** Components are organized by feature in the `src/components` directory.
- **Error Handling:** The contact form has a fallback to `mailto:` if the backend API is unreachable.

## Future Considerations

- **Authentication:** Currently, the `/admin` route is unprotected. Implementing basic authentication would be a logical next step if deployed publicly.
- **Database:** For larger scale, consider migrating from `messages.json` to a database like MongoDB or PostgreSQL.
- **TypeScript:** Migrating to TypeScript for better type safety as recommended by the Vite template.
