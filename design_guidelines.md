# Design Guidelines: ChatGPT Clone with Multi-LLM Configuration

## Design Approach

**Selected Approach**: Reference-Based + Design System Hybrid  
**Primary Reference**: ChatGPT interface with modern productivity tool patterns  
**Justification**: Utility-focused chat application requiring familiar, efficient UX with minimal learning curve. Users expect ChatGPT-like patterns for conversation interfaces.

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**
- Background: 212 100% 5% (deep charcoal, main canvas)
- Surface: 212 50% 8% (elevated panels, sidebar)
- Surface Elevated: 212 40% 12% (chat bubbles, cards)
- Border: 212 30% 18% (subtle dividers)
- Text Primary: 0 0% 98% (high contrast)
- Text Secondary: 0 0% 70% (muted info)
- Accent Primary: 210 100% 60% (interactive elements, links)
- Accent Secondary: 280 65% 65% (provider badges, highlights)
- Success: 142 71% 45% (status indicators)
- Warning: 38 92% 50% (alerts)

**Light Mode**
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Surface Elevated: 210 20% 96%
- Border: 0 0% 88%
- Text Primary: 0 0% 10%
- Text Secondary: 0 0% 45%
- Accent Primary: 210 100% 50%
- Accent Secondary: 280 60% 55%

### B. Typography

**Font Families**
- Primary: 'Inter', system-ui, sans-serif (UI, labels, body)
- Monospace: 'JetBrains Mono', 'Fira Code', monospace (code blocks)

**Type Scale**
- Display: 2.5rem/3rem, weight 600 (page headers)
- Heading 1: 1.875rem/2.25rem, weight 600 (section titles)
- Heading 2: 1.5rem/2rem, weight 600 (subsections)
- Body Large: 1rem/1.75rem, weight 400 (chat messages)
- Body: 0.875rem/1.5rem, weight 400 (UI text, labels)
- Caption: 0.75rem/1.25rem, weight 500 (metadata, timestamps)

### C. Layout System

**Spacing Primitives**: Use Tailwind units 1, 2, 3, 4, 6, 8, 12, 16 for consistent rhythm
- Micro spacing: gap-1, gap-2 (tight groupings)
- Component spacing: p-3, p-4, gap-4 (cards, buttons)
- Section spacing: p-6, p-8, gap-8 (major areas)
- Page margins: p-12, p-16 (outer containers)

**Grid Structure**
- Three-column layout: Sidebar (280px) | Main Chat (flex-1) | Settings Panel (320px, collapsible)
- Mobile: Stack vertically, sidebar becomes drawer
- Container max-width: none (full viewport utilization)

### D. Component Library

**Navigation & Sidebar**
- Collapsible left sidebar with chat history list
- New Chat button prominently at top (accent color)
- Chat list items: hover background, active state with left border accent
- Provider selection dropdown integrated into sidebar header
- Settings icon/button for configuration panel toggle

**Chat Interface**
- Messages alternate: User (right-aligned, accent background) | Assistant (left-aligned, surface elevated)
- Message bubbles: rounded-xl, px-4 py-3, max-width prose
- Timestamp: caption size, text-secondary, below each message
- Avatar indicators: small circular badges with provider icons/initials
- Streaming indicator: animated dots or cursor for real-time responses

**Input Area**
- Fixed bottom textarea with rounded-2xl border
- Multi-line input with auto-height (max 8 lines)
- Send button integrated into input (absolute positioned right)
- Attach/upload icon (if needed for future features)
- Character/token count subtle indicator

**Configuration Panel**
- Slide-in right panel (or modal on mobile)
- Provider cards: display name, model dropdown, status badge
- Three provider sections: OpenAI | Anthropic | Gemini
- Each with: logo/icon, model selector, temperature slider, max tokens input
- Active provider highlighted with accent border
- Save/Apply button at bottom with surface elevated background

**Buttons & Controls**
- Primary: accent background, white text, rounded-lg, px-4 py-2
- Secondary: border accent, accent text, rounded-lg, px-4 py-2
- Ghost: transparent, hover surface, rounded-lg, px-3 py-1.5
- Icon buttons: w-10 h-10, rounded-lg, hover background
- Dropdown selects: border subtle, rounded-lg, hover border accent

**Message Formatting**
- Markdown rendering: headings, lists, links, bold/italic
- Code blocks: monospace font, background surface, border subtle, rounded-lg, syntax highlighting
- Inline code: background surface elevated, px-2 py-0.5, rounded
- Links: accent color, underline on hover
- Tables: border collapse, border subtle, alternate row backgrounds

**Data Display**
- Chat history list: compact items with preview text (2 lines truncated)
- Model badges: pill shape, small size, background accent/10, text accent
- Status indicators: small dots (success/warning colors) with labels
- Empty states: centered illustrations with helpful text

### E. Interaction Patterns

**Animations**: Minimal, purposeful only
- Sidebar slide: 200ms ease-in-out
- Message appear: 150ms fade-in from bottom
- Typing indicator: subtle pulse animation
- Button states: 100ms transitions for background/border
- No scroll-driven or decorative animations

**Hover States**
- Subtle background change (opacity 5-10%)
- Border color shift to accent (for outlined elements)
- Scale transforms avoided for performance

**Focus States**
- 2px accent color ring with offset
- High contrast for keyboard navigation
- Visible on all interactive elements

### F. Responsive Behavior

**Breakpoints**
- Mobile (<768px): Stack layout, drawer navigation, full-width chat
- Tablet (768-1024px): Persistent sidebar, collapsible settings
- Desktop (>1024px): Three-column layout with all panels visible

**Mobile Optimizations**
- Bottom sheet for settings instead of right panel
- Floating action button for new chat
- Swipe gestures for sidebar toggle
- Larger tap targets (min 44px)

## Key Design Principles

1. **Conversation First**: Chat area dominates viewport, minimal chrome
2. **Scannable History**: Quick access to previous conversations with visual hierarchy
3. **Effortless Switching**: Provider/model changes require minimal clicks
4. **Readable Messages**: Generous line height, optimal measure for long-form text
5. **Progressive Disclosure**: Advanced settings hidden until needed

## Visual Hierarchy

**Primary Focus**: Chat conversation area (70% visual weight)  
**Secondary**: Sidebar navigation (20% visual weight)  
**Tertiary**: Configuration panel (10%, on-demand)

Use size, color contrast, and spacing to guide attention to active conversation while keeping controls accessible but unobtrusive.