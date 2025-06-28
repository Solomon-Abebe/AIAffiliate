# AffiliatePro - AI-Powered Product Recommendation Platform

## Overview

AffiliatePro is a modern web application that combines AI-powered product recommendations with affiliate marketing. The platform features a React frontend, Express.js backend, PostgreSQL database with Drizzle ORM, and integrates OpenAI for intelligent chat assistance. Users can browse products, get personalized recommendations through an AI chatbot, read reviews, and make informed purchasing decisions.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite with hot module replacement
- **UI Components**: Comprehensive shadcn/ui component library

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **AI Integration**: OpenAI API for chat responses and product recommendations
- **Session Management**: Connect-pg-simple for PostgreSQL-based sessions
- **Development**: Hot reload with Vite middleware integration

### Database Design
- **ORM**: Drizzle with PostgreSQL dialect
- **Schema**: Products, testimonials, newsletters, contacts, and chat messages
- **Migration**: Drizzle Kit for schema management
- **Connection**: Environment-based DATABASE_URL configuration

## Key Components

### Product Management
- Product catalog with categories, pricing, and ratings
- Featured products highlighting
- Product search and filtering capabilities
- Affiliate link tracking and management

### AI Chat System
- OpenAI GPT-4o integration for intelligent responses
- Session-based chat history persistence
- Product recommendation generation
- Context-aware shopping assistance

### User Interaction
- Newsletter subscription management
- Contact form with structured data collection
- Testimonial display system
- Responsive design for mobile and desktop

### UI/UX Components
- Modern component library with shadcn/ui
- Accessible design patterns
- Dark/light mode support
- Mobile-responsive navigation

## Data Flow

1. **Frontend Requests**: React components use TanStack Query to fetch data from Express APIs
2. **API Processing**: Express routes handle business logic and database operations
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions with type safety
4. **AI Integration**: OpenAI API processes chat messages and generates recommendations
5. **Response Delivery**: JSON responses flow back through the query client to React components

## External Dependencies

### Core Technologies
- **Database**: Neon PostgreSQL (serverless)
- **AI Service**: OpenAI API for chat and recommendations
- **Authentication**: Session-based with PostgreSQL storage
- **Email**: Newsletter subscription handling
- **CDN**: Unsplash for product imagery

### Development Tools
- **Package Manager**: npm with lockfile for dependency consistency
- **Type Checking**: TypeScript with strict configuration
- **Linting**: ESLint with React and TypeScript rules
- **Build**: Vite for development and production builds
- **Database**: Drizzle Kit for migrations and schema management

## Deployment Strategy

### Development Environment
- Vite development server with HMR
- Express server with hot reload
- Environment variable management for database and API keys
- Replit integration with development banners

### Production Build
- Vite builds optimized React bundle
- ESBuild bundles Express server for Node.js
- Static assets served from dist/public
- Environment-based configuration management

### Database Management
- Drizzle migrations for schema evolution
- Environment-based connection string
- Session storage in PostgreSQL
- Automated schema validation

## Changelog
- June 28, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.