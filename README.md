# T3 Chat - AI Chat Application

A modern, full-stack AI chat application built with Next.js 16, featuring multi-model AI integration through OpenRouter, real-time streaming chat, and secure authentication.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Architecture](#architecture)
- [Contributing](#contributing)

## Overview

T3 Chat is a modern AI chat application that provides seamless access to multiple AI models through OpenRouter integration. Built with Next.js 16 and the Vercel AI SDK, it features real-time streaming responses, persistent chat history, and GitHub OAuth authentication. The application demonstrates best practices for full-stack development with Next.js App Router, Prisma ORM, and Better Auth.

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
- **Vercel AI SDK** - Streaming AI responses with useChat hook
- **OpenRouter Integration** - Access to multiple AI models (OpenAI, Anthropic, Google, Meta, etc.)
- **Dynamic Model Selection** - Runtime switching between different AI models
- **Model Discovery** - Automated fetching and display of available models via API
- **Streaming Chat** - Real-time message streaming with full conversation context
- **Message Persistence** - Automatic saving of chat history to PostgreSQL database

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
- **Vercel AI SDK 3.0** - AI chat interface with streaming support
- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn/ui** - Re-usable component library built on Radix UI
- **React Hook Form 7.71** - Performant form validation and management
- **Zod 4.3** - TypeScript-first schema validation
- **TanStack Query 5.90** - Powerful data synchronization and state management

### Backend
- **Next.js API Routes** - Serverless API endpoints with streaming support
- **OpenRouter AI SDK 2.0** - Multi-model AI provider integration
- **Better-Auth 1.4** - Modern authentication library with OAuth support
- **Prisma 7.2** - Next-generation ORM with type safety and migrations
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
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI Streaming Interface
- [OpenRouter](https://openrouter.ai/) - AI Model Gateway
- [Shadcn/ui](https://ui.shadcn.com/) - Component System
- [Better-Auth](https://www.better-auth.com/) - Authentication Library
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Radix UI](https://www.radix-ui.com/) - UI Primitives

---

**T3 Chat** - Modern AI chat application powered by Next.js and OpenRouter
