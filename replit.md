# نظام الجفر الذكي المتقدم - Jafr Analysis System

## Overview

This is a full-stack Arabic numerology (Jafr) analysis application that combines traditional Islamic numerical calculations with AI-powered interpretations. The system calculates Abjad values for names, mother's names, and questions, then provides spiritual guidance and insights using artificial intelligence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom Arabic theme
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for client-side routing
- **Language**: Right-to-left (RTL) Arabic interface with Tajawal font

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API**: RESTful endpoints for Jafr analysis
- **Build Tool**: Vite for development and esbuild for production
- **Development**: Hot module replacement with Vite middleware

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Storage Layer**: DatabaseStorage class implementing IStorage interface
- **Session Management**: PostgreSQL sessions with connect-pg-simple
- **Analysis History**: Complete Jafr analysis records stored with JSON fields
- **Database Provider**: Neon serverless PostgreSQL

## Key Components

### Jafr Calculation Engine
- **Traditional Abjad**: Full Arabic alphabet numerical values (1-1000)
- **Small Abjad**: Simplified numerical system (1-28)
- **Analysis Types**: Name analysis, mother's name analysis, question analysis
- **Mathematical Operations**: Total summation, single-digit reduction, Wafq size calculation

### AI Integration Service
- **Provider**: OpenRouter API with DeepSeek Chat v3 model
- **API Key Management**: Client-side secure storage with server validation
- **Capabilities**: Contextual spiritual interpretation, numerical insights, guidance generation
- **Response Format**: Structured JSON with Arabic text responses
- **Fallback**: Basic traditional analysis when AI is disabled
- **Security**: API keys stored locally in browser, not on server

### User Interface Components
- **API Key Setup**: Secure client-side configuration for OpenRouter access
- **Calculator Form**: Multi-step input form with validation
- **Results Display**: Detailed analysis breakdown with visual elements
- **Progress Tracking**: Real-time analysis progress indicators
- **API Management**: Change API key functionality with validation
- **History Page**: Browse and view all saved Jafr analysis records
- **Navigation**: Modern navigation bar with active state indicators
- **Responsive Design**: Mobile-first approach with RTL support

## Data Flow

1. **User Input**: Name, mother's name, and question entered through form
2. **Validation**: Zod schema validation on both client and server
3. **Traditional Calculation**: Abjad numerical analysis performed
4. **AI Analysis**: Optional deep analysis sent to AI service
5. **Results Compilation**: Traditional and AI results combined
6. **Response Delivery**: Formatted analysis returned to client
7. **Display**: Results rendered with Arabic typography and animations

## External Dependencies

### AI Services
- **OpenRouter API**: Primary AI provider for interpretations
- **OpenAI Compatibility**: Fallback support for OpenAI API
- **Model**: DeepSeek Chat v3 (free tier) for Arabic analysis

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection**: Environment variable based configuration
- **Migration**: Drizzle Kit for schema management

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for UI elements
- **React Hook Form**: Form state management with validation

## Deployment Strategy

### Development Environment
- **Replit Integration**: Native Replit development support
- **Hot Reloading**: Vite dev server with HMR
- **Environment Variables**: Local .env configuration
- **Database**: Development database connection

### Production Build
- **Frontend**: Vite production build with optimization
- **Backend**: esbuild bundling for Node.js deployment
- **Assets**: Static file serving from dist/public
- **Process Management**: PM2 or similar for production

### Environment Configuration
- **Database**: PostgreSQL connection string required
- **AI API**: OpenRouter or OpenAI API key required
- **Session**: Secure session configuration for authentication
- **CORS**: Configured for production domain access

## Changelog

```
Changelog:
- June 30, 2025. Initial setup
- June 30, 2025. Added OpenRouter API integration with client-side key management
- June 30, 2025. Implemented API key validation and secure storage system
- June 30, 2025. Added DeepSeek Chat v3 model for advanced Jafr analysis
- June 30, 2025. Integrated PostgreSQL database with Drizzle ORM
- June 30, 2025. Added analysis history storage and retrieval functionality
- June 30, 2025. Created History page with navigation for viewing saved analyses
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```