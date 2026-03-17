# Nx React Monorepo Portfolio Project

## Overview

This repository is a full-stack portfolio demonstration project built using Nx monorepo architecture and React, showcasing my skills as a junior full-stack developer. It demonstrates how to structure scalable front-end applications, implement routing and reusable shared libraries, integrate backend services, and manage a modular, maintainable codebase using modern TypeScript tooling. The project includes a React frontend and an Express backend, and it serves as a working example of a full-stack application with real API integrations.

## Tech Stack

- Frontend: React (Functional Components + Hooks), TypeScript, React Router
- Monorepo: Nx architecture, shared components and utilities
- Backend: Node.js, Express, Resend API (for email sending), Spotify API integration, OpenWeather API integration
- Other Tools: npm

## Features

- Music Dashboard: Fetches and displays artist and album data from the Spotify API via the backend. Processes album and track information in the backend service layer and visualizes insights on the frontend using charts and sortable lists.
- Weather Dashboard: Allows users to search cities and view real-time weather data pulled securely from the OpenWeather API through the backend.
- Contact Page: Full-stack contact form that sends emails via Resend API, handled securely through the backend with loading indicators and success/error messages.
- Navigation and UI: Responsive top navigation bar with links to all pages, a burger menu for smaller screens that closes when clicking outside, and reusable shared components and hooks for maintainability.
- Backend Services: Modular Express backend managing API requests, data transformation, and email sending. Centralized service layer for Spotify, OpenWeather, and Resend APIs.
- Architecture Highlights: Monorepo structure with clear apps vs libs separation. Frontend handles presentation and user interaction; backend handles API communication, validation, and third-party integrations. Clean, scalable, and maintainable code organization.

## Project Structure

- react-app/ → Main React application (frontend)
- libs/shared/ → Shared utilities and UI components
- server/ → Express backend application
- nx.json → Nx workspace configuration
- tsconfig.base.json → Centralized TypeScript configuration

## Running the Project Locally

**Prerequisites:** Node.js (v18+ recommended), npm

**Steps to run everything locally (single flow):**

# Clone the repository

git clone https://github.com/SimulacraGHub/ra-proj.git
cd ra-proj

# Install all dependencies

npm install

# Build the backend

npx nx build server

# Build the frontend

npx nx build react-app

# Serve the backend

npx nx serve server

# Serve the frontend

npx nx serve react-app

## Environment Variables

Create a `.env` file in the root of the workspace with the following keys (replace with your real API keys):
Open your browser at http://localhost:4200. During development, you can also run the backend directly with `npx ts-node server/src/main.ts` to ensure environment variables like `RESEND_API_KEY` are correctly loaded.

## Environment Variables

Create a `.env` file in the root of the workspace with the following keys (replace with your real API keys):

```env
RESEND_API_KEY=your_real_resend_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_secret
FRONTEND_URL=http://localhost:4200
```

## Purpose

This project demonstrates understanding of modern full-stack and frontend tooling, ability to work in a monorepo architecture with shared logic, clean and maintainable project structure, integration of backend services with frontend applications, handling of third-party API data and error states, and use of reusable components and hooks to improve scalability and developer experience.

## Author

**Ruan K**, Junior Full-Stack Developer
