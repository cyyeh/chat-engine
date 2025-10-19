# AI Chat Application with Multi-LLM Support

## Overview

This is a ChatGPT-style conversational AI application that allows users to interact with multiple Large Language Model (LLM) providers. The application supports OpenAI, Anthropic (Claude), and Google Gemini models, enabling users to switch between different AI providers and models within a unified chat interface. Built with a modern stack featuring React, TypeScript, Express, and PostgreSQL, the application provides a familiar chat experience with conversation management and real-time message streaming.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Framework**: React 18 with TypeScript, using Vite as the build tool for fast development and optimized production builds.

**UI Component Library**: Shadcn UI with Radix UI primitives, providing a consistent design system following the "New York" style variant. The application uses Tailwind CSS for styling with a custom color palette supporting both dark and light themes.

**State Management**: 
- React Query (TanStack Query) for server state management, handling API requests, caching, and automatic refetching
- Local React state for UI-specific concerns like typing indicators, settings panel visibility, and message composition

**Routing**: Wouter for lightweight client-side routing (currently single-page with potential for expansion)

**Design System**:
- Dark mode as primary theme with comprehensive light mode support
- Custom HSL-based color system with semantic color tokens
- Typography using Inter for UI elements and JetBrains Mono for code blocks
- Consistent spacing and elevation system through Tailwind utilities

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript for type safety.

**API Design**: RESTful API structure with endpoints for:
- Conversation management (CRUD operations)
- Message retrieval and creation
- LLM provider integration for streaming responses

**LLM Provider Integration**:
- OpenAI SDK for GPT models
- Anthropic SDK for Claude models  
- Google GenAI SDK for Gemini models
- Each provider configured independently with API key support
- Streaming response handling for real-time message generation

**Storage Layer**: Abstracted storage interface (`IStorage`) allowing for multiple implementations:
- In-memory storage (`MemStorage`) for development/testing
- PostgreSQL database schema using Drizzle ORM for production
- Schema includes conversations and messages tables with proper relationships

### Data Model

**Database Schema** (PostgreSQL with Drizzle ORM):

**Conversations Table**:
- `id`: UUID primary key (auto-generated)
- `title`: Text field for conversation name
- `lastMessage`: Timestamp tracking most recent activity

**Messages Table**:
- `id`: UUID primary key (auto-generated)
- `conversationId`: Foreign key reference to conversations
- `role`: Text field ("user" or "assistant")
- `content`: Text field for message content
- `provider`: Optional text field identifying which LLM generated the response
- `timestamp`: Timestamp of message creation

**Design Rationale**: The schema separates conversations from messages for efficient querying and allows multiple messages per conversation while tracking which AI provider generated each response.

## Key Features

### Multi-Provider Support
- Users can switch between OpenAI, Anthropic, and Google Gemini providers
- Each provider has a dedicated settings card with model selection and API key configuration
- Active provider indicator shows which provider is currently in use

### API Key Management
- API keys are stored in local state (not persisted to database for security)
- Validation occurs before sending messages - users are prompted to enter keys if missing
- OpenAI can fall back to Replit AI Integrations if no user key is provided
- Toast notifications alert users when API keys are required but missing

### Conversation Features
- Create multiple conversations with automatic titles
- Messages stream in real-time character by character
- Full conversation history is maintained and sent to LLMs for context-aware responses
- Delete conversations from the sidebar
- Conversation list shows most recent conversations first

### User Interface
- ChatGPT-inspired three-column layout: sidebar, chat area, settings panel
- Dark mode as default with light mode toggle
- Responsive design with collapsible sidebar
- Typing indicator during AI response generation
- Markdown rendering for message content with syntax-highlighted code blocks

### Authentication & Authorization

Currently not implemented - the application is designed for single-user or development use. Authentication would need to be added for multi-user production deployments.

## External Dependencies

### Required Services

**PostgreSQL Database**: 
- Provisioned via Neon serverless PostgreSQL (`@neondatabase/serverless`)
- Connection configured through `DATABASE_URL` environment variable
- Required for persistent storage in production

### LLM Provider APIs

**OpenAI**:
- SDK: `openai` package
- Supports user-provided API key or falls back to Replit AI Integrations
- Available models: gpt-4.1, gpt-4.1-mini, gpt-4.1-nano, gpt-5.1, gpt-5.1-mini, gpt-5.1-nano

**Anthropic**:
- SDK: `@anthropic-ai/sdk`
- Requires user-provided API key
- Available models: claude-3-5-sonnet, claude-3-opus, claude-3-haiku

**Google Gemini**:
- SDK: `@google/genai`
- Requires user-provided API key
- Available models: gemini-2.0-flash, gemini-1.5-pro, gemini-1.5-flash

### Development Tools

**Drizzle Kit**: Database schema management and migrations (`drizzle-kit`)

**Vite**: Development server with HMR and production bundling

**Replit Plugins**: Development-specific tooling for the Replit environment including runtime error overlay, cartographer for file navigation, and dev banner

### UI Component Dependencies

- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives
- **React Markdown**: Markdown rendering for message content
- **React Syntax Highlighter**: Code block syntax highlighting with Prism
- **Lucide React**: Icon library
- **React Icons**: Additional icons (Simple Icons for provider logos)