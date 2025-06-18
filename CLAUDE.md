# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start Vite development server with HMR
- `npm run build` - Build for production (runs TypeScript check first)
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview production build locally

### Convex Backend
- `npx convex dev` - Start Convex development environment
- `npx convex deploy` - Deploy Convex functions to production

## Architecture Overview

### Technology Stack
- **Frontend**: React 19.1.0 with TypeScript, built with Vite
- **Backend**: Convex (real-time backend-as-a-service)
- **Build Tool**: Vite 6.3.5 for fast development and building
- **Linting**: ESLint with React and TypeScript rules

### Project Structure
- `src/` - React application source code
- `convex/` - Backend functions and database schema
  - `_generated/` - Auto-generated Convex API types (do not edit)
- `public/` - Static assets served by Vite

### Key Configuration Files
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript project references
- `tsconfig.app.json` - App-specific TypeScript config
- `convex/tsconfig.json` - Convex-specific TypeScript config
- `eslint.config.js` - ESLint flat config with React rules

## Development Patterns

### TypeScript Configuration
- Strict mode enabled throughout the project
- ES2020 target with bundler module resolution
- React JSX transform (no need to import React in components)

### Convex Integration
- Database queries and mutations are defined in `convex/` directory
- Types are auto-generated in `convex/_generated/`
- Use Convex client hooks in React components for real-time data

### Code Quality
- ESLint enforces React hooks rules and TypeScript best practices
- Always run `npm run lint` before committing changes
- Build process includes TypeScript compilation check

## Indoor Navigation Context

This appears to be an indoor navigation web application. When working on features:
- Consider real-time location tracking capabilities
- Plan for map/floor plan rendering
- Think about user positioning and pathfinding algorithms
- Consider mobile-responsive design for on-device usage