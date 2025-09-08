# Overview

Cloutline is a SaaS application for generating viral hooks for TikTok and Instagram Reels using AI. It helps content creators generate engaging opening lines for their videos with multiple hook styles (bold statement, relatable pain, curiosity, transformation, storytelling). The app features a freemium model with usage limits, Stripe payment integration, and user authentication through Replit Auth.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing
- **UI Library**: shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **State Management**: TanStack Query for server state management and data fetching
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Custom auth hook that checks user session via API calls

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with route registration pattern
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: Express sessions with PostgreSQL session store
- **Error Handling**: Centralized error middleware with status code mapping

## Data Storage
- **Database**: PostgreSQL with Neon serverless database
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema Design**: 
  - Users table with subscription tiers and usage tracking
  - Hooks table for storing generated content
  - Sessions table for authentication (required by Replit Auth)
- **Migrations**: Drizzle Kit for database schema management

## Authentication & Authorization
- **Provider**: Replit Auth using OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple
- **Middleware**: Route-level authentication guards
- **User Management**: Automatic user creation/update on login

## External Dependencies
- **AI Service**: OpenAI API for hook generation using GPT models
- **Payment Processing**: Stripe for subscription management and billing
- **Database**: Neon PostgreSQL for serverless database hosting
- **Authentication**: Replit Auth service for user identity management
- **Development**: Replit platform integration with cartographer plugin