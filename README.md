# T3-Chat - Enterprise AI Chat Application

A full-stack, production-ready AI chat application built with Next.js 16, featuring multi-model AI integration, real-time chat capabilities, and enterprise-grade authentication.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## Overview

T3-Chat is a comprehensive enterprise-grade chat application built using modern web technologies and best practices. The application integrates advanced AI capabilities through OpenRouter, providing users with access to multiple AI models within a seamless, secure, and scalable interface. The project demonstrates production-ready patterns for authentication, database management, API design, and user interface development.

## Features

### Authentication & Security
- **Better-Auth Integration** - Industry-standard authentication system with session management
- **OAuth Support** - GitHub OAuth integration with extensible provider architecture
- **Custom Authentication Pages** - Branded sign-in and registration flows
- **Protected Routes** - Role-based access control and secure session handling

### Chat Interface
- **Real-time Chat** - Responsive, interactive messaging interface
- **Sidebar Navigation** - Intuitive chat organization and management
- **Cross-platform Compatibility** - Fully responsive design for desktop, tablet, and mobile
- **Theme Support** - Dark and light mode with persistent user preferences

### AI Integration
- **Multi-Model Support** - Integration with various AI models via OpenRouter
- **Dynamic Model Selection** - Runtime switching between different AI models
- **Model Discovery** - Automated fetching and display of available models
- **Conversation Management** - Persistent chat history and context handling

### Database & Backend
- **Prisma ORM** - Type-safe database operations with automated migrations
- **PostgreSQL** - Production-grade relational database
- **Docker Support** - Containerized development environment
- **Schema Versioning** - Comprehensive migration system for database evolution

### UI Components
- **Shadcn/ui** - Professional component library with accessibility support
- **Tailwind CSS** - Utility-first CSS framework for rapid development
- **Radix UI** - Unstyled, accessible component primitives
- **Icon System** - Comprehensive Lucide icon integration

## Tech Stack

### Frontend
- **Next.js 16.1** - React framework with App Router architecture
- **React 19.2** - JavaScript library for building user interfaces
- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn/ui** - Re-usable component library built on Radix UI
- **React Hook Form 7.71** - Performant form validation and management
- **Zod 4.3** - TypeScript-first schema validation
- **TanStack Query 5.90** - Powerful data synchronization and state management

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Better-Auth 1.4** - Modern authentication library
- **Prisma 7.2** - Next-generation ORM with type safety
- **PostgreSQL** - Advanced open-source relational database
- **pg 8.16** - PostgreSQL client for Node.js

### DevOps & Tooling
- **Docker Compose** - Multi-container orchestration
- **ESLint 9** - Code quality and consistency
- **PostCSS** - CSS transformation and optimization
- **Prisma Migrations** - Database version control

## 📁 Project Structure

```
t3-chat/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── (auth)/           # Authentication routes
│   │   │   └── sign-in/
│   │   ├── (root)/           # Main application routes
│   │   └── api/              # API endpoints
│   │       ├── ai/           # AI-related endpoints
│   │       └── auth/         # Auth endpoints
│   ├── components/
│   │   ├── providers/        # React context providers
│   │   └── ui/              # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   │   ├── auth.js          # Auth configuration
│   │   ├── auth-client.js   # Client-side auth
│   │   ├── db.js            # Database client
│   │   └── utils.js         # Helper functions
│   └── modules/
│       ├── ai-agent/        # AI functionality
│       ├── authentication/   # Auth components
│       └── chat/            # Chat features
├── docker-compose.yml        # Docker configuration
├── next.config.mjs          # Next.js configuration
└── package.json             # Dependencies

```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** - Version 18.0 or higher
- **Package Manager** - npm, yarn, or pnpm
- **Docker Desktop** - Version 20.10 or higher with Docker Compose
- **Git** - Version control system
- **OpenRouter Account** - For AI model access

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd t3-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Environment Setup

Create a `.env.local` file in the root directory with the following configuration:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"

# Authentication
BETTER_AUTH_SECRET="<generate-using-openssl-rand-base64-32>"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth Providers (Optional)
GITHUB_CLIENT_ID="<your-github-oauth-client-id>"
GITHUB_CLIENT_SECRET="<your-github-oauth-client-secret>"

# AI Integration
OPENROUTER_API_KEY="<your-openrouter-api-key>"
```

### Configuration Steps

1. **Generate Authentication Secret**
   ```bash
   openssl rand -base64 32
   ```

2. **Configure GitHub OAuth** (Optional)
   - Navigate to GitHub Settings → Developer settings → OAuth Apps
   - Create new OAuth application
   - Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
   - Copy Client ID and Client Secret to environment file

3. **Obtain OpenRouter API Key**
   - Register at [OpenRouter](https://openrouter.ai/)
   - Generate API key from dashboard
   - Add key to environment configuration

## Database Setup

1. **Initialize PostgreSQL container**
   ```bash
   docker compose up -d
   ```

2. **Apply database migrations**
   ```bash
   npx prisma migrate dev
   ```

3. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

4. **Verify database connection** (Optional)
   ```bash
   npx prisma studio
   ```

## Running the Application

### Development Environment

```bash
npm run dev
```

The development server will start on [http://localhost:3000](http://localhost:3000) with hot-reloading enabled.

### Production Build

```bash
npm run build
npm start
```

### Additional Commands

```bash
# Code linting
npm run lint

# Database operations
npx prisma migrate dev          # Create and apply migrations
npx prisma migrate reset        # Reset database
npx prisma db push             # Push schema changes without migrations
npx prisma studio              # Open database GUI

# Docker operations
docker compose up -d           # Start services
docker compose down            # Stop services
docker compose logs            # View logs
```

## Architecture

### Application Structure

The application follows a modular architecture with clear separation of concerns:

- **App Router** - Next.js 16 App Router for routing and layouts
- **Server Components** - Default server-side rendering for optimal performance
- **API Routes** - RESTful API endpoints in `/app/api`
- **Database Layer** - Prisma ORM with PostgreSQL for data persistence
- **Authentication Layer** - Better-Auth with session management
- **Component Library** - Reusable UI components with Shadcn/ui

### Key Architectural Decisions

- **Type Safety** - End-to-end TypeScript with Prisma for database types
- **Server-First** - Leveraging React Server Components for improved performance
- **Modular Design** - Feature-based organization in `/src/modules`
- **Containerization** - Docker for consistent development environments
- **Schema Validation** - Zod schemas for runtime type validation

## Contributing

We welcome contributions to T3-Chat. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code adheres to the existing style and passes all linting checks.


## Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Shadcn/ui](https://ui.shadcn.com/) - Component System
- [Better-Auth](https://www.better-auth.com/) - Authentication Library
- [Prisma](https://www.prisma.io/) - Database ORM
- [OpenRouter](https://openrouter.ai/) - AI Model Gateway
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Radix UI](https://www.radix-ui.com/) - UI Primitives

---

**T3-Chat** - Built with modern web technologies for scalable AI chat applications
