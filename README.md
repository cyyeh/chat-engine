# AI Chat Application

A ChatGPT-style conversational AI application with multi-LLM provider support. Chat with OpenAI's GPT models, Anthropic's Claude, or Google's Gemini - all in one unified interface.

## Features

### Multi-Provider Support
- **OpenAI**: gpt-4.1, gpt-4.1-mini, gpt-4.1-nano, gpt-5.1, gpt-5.1-mini, gpt-5.1-nano
- **Anthropic**: claude-3-5-sonnet, claude-3-opus, claude-3-haiku
- **Google Gemini**: gemini-2.0-flash, gemini-1.5-pro, gemini-1.5-flash

### Core Capabilities
- **Real-time Streaming**: Messages stream in character-by-character for a natural chat experience
- **Conversation History**: Full context maintained across turns for coherent multi-turn conversations
- **Multiple Conversations**: Create and manage multiple chat sessions
- **Provider Switching**: Seamlessly switch between AI providers mid-conversation
- **API Key Management**: Secure API key configuration directly in the UI
- **Dark/Light Mode**: Full theme support with toggle

### User Interface
- ChatGPT-inspired three-column layout
- Collapsible sidebar for conversation management
- Settings panel for provider configuration
- Markdown rendering with syntax-highlighted code blocks
- Responsive design

## Getting Started

### Prerequisites
- Node.js 18 or higher
- API keys for the providers you want to use:
  - OpenAI API key (required)
  - Anthropic API key (required)
  - Google AI API key (required)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Configuration

#### API Keys
Configure your API keys directly in the application:

1. Click the settings icon in the top-right corner
2. Select your preferred provider
3. Enter your API key in the provider's settings card
4. Choose your desired model from the dropdown

**Note**: All providers require valid API keys to function.


## Usage

### Starting a Conversation

1. Click **"New Chat"** in the sidebar to create a new conversation
2. Select your preferred AI provider in the settings panel
3. Type your message in the input box at the bottom
4. Press Enter or click the send button

### Managing Conversations

- **Switch Conversations**: Click on any conversation in the sidebar to view its history
- **Delete Conversations**: Hover over a conversation and click the delete icon
- **Conversation Titles**: Each conversation starts with "New Conversation" as the default title

### Provider Settings

Each provider card in the settings panel allows you to:
- Set/update API keys
- Select models
- Activate the provider for use

The active provider is indicated by a green status badge.

## Technical Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TanStack Query for data fetching
- Shadcn UI + Radix UI components
- Tailwind CSS for styling
- Wouter for routing

### Backend
- Express.js with TypeScript
- Server-Sent Events (SSE) for streaming
- In-memory storage (development)
- PostgreSQL with Drizzle ORM (production-ready)

### AI Provider SDKs
- `openai` - OpenAI GPT models
- `@anthropic-ai/sdk` - Anthropic Claude models
- `@google/genai` - Google Gemini models

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and helpers
│   │   └── hooks/         # Custom React hooks
├── server/                # Backend Express server
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Storage interface and implementations
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema and Zod types
└── README.md             # This file
```

## API Endpoints

- `GET /api/conversations` - List all conversations
- `POST /api/conversations` - Create a new conversation
- `DELETE /api/conversations/:id` - Delete a conversation
- `GET /api/conversations/:id/messages` - Get messages for a conversation
- `POST /api/chat` - Send a message and receive streaming response

## Development

### Running the Application
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

## Storage

The application currently uses in-memory storage for development. For production use, it includes a PostgreSQL schema ready for deployment with Drizzle ORM.

## Security Notes

- API keys are stored in browser local state (not persisted to database)
- Keys are validated before sending messages
- Never commit API keys to version control
- Use environment variables for server-side API key management

## Troubleshooting

### "API Key Required" Error
Make sure you've entered a valid API key for the selected provider in the settings panel.

### Streaming Not Working
Check your network connection and ensure the API key is valid. Check the browser console for detailed error messages.

### Messages Not Persisting
Currently using in-memory storage - conversations are lost on server restart. For persistence, configure a PostgreSQL database.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.
