# Overview

This is a production-ready Admin Portal built with modern web technologies for monitoring shops, inventory, and sales data. The application follows a clean architecture pattern with a React frontend and Express backend, designed to provide real-time insights into shop operations, stock levels, and sales performance with comprehensive reporting capabilities.

The project implements a full-stack solution using TypeScript throughout, with a focus on type safety, scalability, and maintainable code. It features a professional enterprise-grade UI built with shadcn/ui components and follows Fluent Design System principles for optimal data visualization and user experience.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with Vite for fast development and optimized builds
- **TypeScript**: Full type safety across the application with strict configuration
- **Styling**: TailwindCSS with custom design system based on Fluent Design principles
- **UI Components**: shadcn/ui built on Radix primitives for accessibility and consistency
- **State Management**: React Query (TanStack Query) for server state and caching
- **Data Tables**: TanStack Table for headless, performant data visualization
- **Charts**: Recharts for sales analytics and dashboard visualizations
- **Routing**: Wouter for lightweight client-side routing
- **Theme System**: Custom light/dark mode with CSS variables and system preference detection

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **API Pattern**: RESTful endpoints with JSON responses
- **TypeScript**: Shared types between frontend and backend via shared schema
- **Development**: Hot reload with Vite integration and error overlay
- **Build System**: ESBuild for production builds with external package handling

## Data Layer Design
The application uses a shared schema approach with Drizzle ORM, allowing type definitions to be shared between client and server. The database schema is designed around core entities:
- User management with authentication
- Shop monitoring with status tracking
- Inventory management with real-time stock levels
- Sales transaction recording and reporting
- Audit trails and activity logging

## Authentication & Authorization
- JWT-based authentication system (currently mocked in development)
- Role-based access control (admin/viewer roles)
- Session management with secure token handling
- Protected routes and API endpoints

## UI/UX Architecture
The design follows enterprise application patterns:
- **Information Hierarchy**: Clear visual organization of complex data sets
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Accessibility**: WCAG compliant components via Radix primitives
- **Theme System**: Professional color palette with light/dark mode support
- **Data Visualization**: Chart.js integration for sales analytics and KPI dashboards

# External Dependencies

## Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL with WebSocket connections
- **Database Migrations**: Drizzle Kit for schema management and migrations

## UI & Component Library
- **Radix UI**: Headless accessible components (@radix-ui/react-*)
- **Lucide React**: Consistent icon system
- **Recharts**: Chart and visualization library for analytics dashboards
- **React Hook Form**: Form validation with @hookform/resolvers integration

## Development & Build Tools
- **Vite**: Frontend build tool with HMR and optimized production builds
- **TailwindCSS**: Utility-first CSS framework with PostCSS processing
- **TypeScript**: Type checking and compilation
- **ESLint & Prettier**: Code quality and formatting (configured but not visible in repo)

## Data Management
- **TanStack Query**: Server state management, caching, and synchronization
- **TanStack Table**: Headless table library for complex data grids
- **Date-fns**: Date manipulation and formatting utilities
- **CSV Export**: csv-stringify for report generation

## Deployment & Environment
- **Replit Integration**: Development environment with hot reload and error reporting
- **Environment Variables**: Secure configuration management for database connections
- **Node.js WebSockets**: Real-time data connections via ws library

The architecture prioritizes developer experience with hot reload, comprehensive TypeScript support, and shared type definitions while maintaining production readiness through proper error handling, security considerations, and scalable data management patterns.