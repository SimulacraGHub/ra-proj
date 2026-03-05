Nx React Monorepo Portfolio Project
Overview

This repository contains a portfolio demonstration project built using Nx monorepo architecture and React.

It showcases a full-stack developer skill set, including:

Structuring scalable front-end applications

Implementing routing and reusable shared libraries

Integrating backend services

Managing a modular codebase with modern TypeScript tooling

The project forms part of my portfolio as a junior full-stack developer.

Tech Stack

Front-End: React (Functional Components + Hooks), TypeScript, React Router

Monorepo: Nx architecture, Shared Component Library

Back-End: Node.js, Express, Resend (for email resender)

Other Tools: npm

Features

Music Page: Fetches and displays artist and album data

Weather Page: Allows users to search cities and view current weather data

Backend Services:

Node + Express server for API endpoints

Email resender service

Reusable Components: Shared UI components in libs/shared

Routing: Clean setup using React Router

Scalable Project Structure: Separation between apps and shared libraries

Architecture Highlights

Monorepo structure using Nx

Clear separation of concerns between front-end app and shared libraries

Centralized TypeScript configuration via tsconfig.base.json

Reusable UI components in libs/shared

Modular and maintainable code structure

Running the Project Locally
Prerequisites

Node.js (v18+ recommended)

npm

Steps

Clone the repository:

git clone <repository-url>
cd <repository-folder>

Install dependencies:

npm install

Start the backend server:

npx nx serve backend

Start the front-end React app:

npx nx serve react-app

Open your browser at:

http://localhost:4200

The backend runs on a separate port (check apps/backend), serving API endpoints for weather, music, and email services.

Project Structure
react-app/ → Main React application
libs/shared/ → Reusable shared components
apps/backend/ → Node + Express backend
nx.json → Nx workspace configuration
tsconfig.base.json → Centralized TypeScript configuration
Purpose

This repository demonstrates:

Understanding of modern front-end and full-stack tooling

Ability to work in a monorepo architecture

Clean Git practices

Structured, maintainable project design

Integration of backend services with frontend applications

Author

Ruan K
Junior Full-Stack Developer
