# DevToolHub - AI-Powered Developer Tool Platform

## Overview

DevToolHub is a specialized web application that combines AI-powered tool recommendations with affiliate marketing, focused specifically on fullstack development. The platform features a React frontend, Express.js backend, PostgreSQL database with Drizzle ORM, and integrates OpenAI for intelligent chat assistance. Developers can browse development tools, courses, and services, get personalized recommendations through an AI chatbot, read expert guides, and make informed decisions for their projects.

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

### Developer Tool Management
- Tool catalog with categories, pricing, and developer ratings
- Featured tools and courses highlighting
- Tool search and filtering capabilities for React/Node.js ecosystem
- Affiliate link tracking and management

### AI Chat System
- OpenAI GPT-4o integration for intelligent developer assistance
- Session-based chat history persistence
- Tool and course recommendation generation
- Context-aware development guidance and best practices

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

## Recent Changes
- June 28, 2025: **MAJOR NICHE UPDATE** - Transformed website to focus on fullstack development tools and resources
- June 28, 2025: Rebranded from "AffiliatePro" to "DevToolHub" throughout the application
- June 28, 2025: Updated product catalog with developer-focused tools (VS Code extensions, React/Node.js courses, cloud services, databases)
- June 28, 2025: Enhanced AI chatbot training for fullstack development expertise and tool recommendations
- June 28, 2025: Updated testimonials with developer-focused feedback from software engineers and tech leads
- June 28, 2025: Created specialized blog content for React, Node.js, TypeScript, and fullstack development
- June 28, 2025: Updated all website copy, navigation, and branding to reflect developer tool focus
- June 28, 2025: Populated database with 6 developer tools/courses, 3 developer testimonials, and 3 technical blog posts

## User Preferences

Preferred communication style: Simple, everyday language.

## Current Status
✓ Fully functional developer tool platform with AI chatbot specialized for fullstack development
✓ Database-driven tool catalog with search capabilities focused on React/Node.js ecosystem
✓ SEO-optimized blog section with detailed technical guides and tutorials
✓ Enhanced AI assistant trained on developer tools and fullstack development best practices
✓ Responsive design with working navigation and developer-focused interactive features
✓ Successfully niched down to serve fullstack developers with specialized content and recommendations