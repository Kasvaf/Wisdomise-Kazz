# Claude Code Workflow Guide - Goatx-Main

## Performance Optimization

**IMPORTANT**: Do NOT read large dependency files. A `.claudeignore` file is configured to prevent reading:
- `node_modules/` - All installed packages
- Build outputs (`dist/`, `build/`)
- Lock files (`yarn.lock`, `package-lock.json`)
- Large binary/generated files

Always respect the `.claudeignore` configuration to maintain optimal performance.

---

## Setup Fresh Local Server (New Clone)

When starting fresh from GitHub:

```bash
# 1. Clone repository
git clone https://github.com/Kasvaf/Goatx-Main
cd Goatx-Main

# 2. Initialize git submodules (CRITICAL - Required for proto files)
git submodule update --init --recursive

# 3. Install dependencies (use yarn, not npm)
yarn install

# 4. Generate proto files
yarn gen-proto

# 5. Start development server
npm run dev
```

**Expected Result**: Server starts on first available port (usually 3002-3006)
**URL**: Check terminal output for `http://localhost:XXXX`

### Troubleshooting Fresh Setup
- If proto generation fails, ensure `protoc-gen-ts_proto.bat` exists in project root
- If port conflicts occur, use: `npx kill-port 3000 3002 3003 3004 3005 3006 5173 8080`
- Always use `yarn` for package management (not npm)

---

## Continue on Current Local Server

When the user says **"continue on current local server"** or **"load up the current local"**:

```bash
# 1. Navigate to project directory
cd C:\Users\kasra\Goatx-Main

# 2. Pull latest changes from GitHub main
git pull origin main

# 3. Check if server is already running
# Look for process on ports 3002-3006

# If server NOT running:
npm run dev

# If server IS running:
# No action needed - hot module reload (HMR) is active
# Changes will auto-reload in browser
```

**Key Points**:
- Local main branch = Latest work from all sessions
- Server auto-reloads on file changes (Vite HMR)
- No need to restart server unless installing new packages

### When to Restart Server
- After `yarn install` (new dependencies)
- After modifying `vite.config.ts`
- After environment variable changes
- If seeing strange build errors

---

## Project Stack & Standards

### ALWAYS Use Project Components & Patterns

**UI Components** - Located in `src/modules/shared/v1-components/`:
- `<Button>` - All buttons
- `<Dialog>` - Modals and drawers
- `<Toggle>` - Switches
- `<Table>` - Data tables
- `<Input>` - Form inputs
- `<Token>` - Token/coin display with icons

**Icons**:
- Use `boxicons-quasar` icons via `<Icon name={iconName} />`
- Import specific icons: `import { bxCog, bxMenu } from 'boxicons-quasar'`
- For network icons: Use `<NetworkIcon network="solana" />` or import from `src/modules/shared/NetworkIcon/`

**Styling**:
- **Tailwind CSS** - Primary styling system
- Utility classes: `text-v1-content-positive`, `bg-v1-surface-l1`, etc.
- Custom colors defined in project config
- Never add inline styles or new CSS files unless absolutely necessary

**State Management**:
- React hooks (`useState`, `useEffect`, etc.)
- Custom hooks in component directories
- React Query for API calls (`useQuery`, `useMutation`)

**Routing**:
- React Router v6
- Use `<Link>` for navigation
- Route definitions in `src/main.tsx` or route config files

**Forms**:
- React Hook Form (`react-hook-form`)
- Form validation patterns from existing forms

### Code Style
- TypeScript (strict mode)
- Biome for linting/formatting (runs on pre-commit)
- Use existing component patterns as reference
- Keep code DRY - reuse existing utilities

### File Structure
```
src/
├── modules/           # Feature modules
│   ├── autoTrader/   # Trading features
│   ├── discovery/    # Coin discovery & details
│   ├── base/         # Core features
│   └── shared/       # Shared UI components
├── services/         # API & backend services
│   ├── grpc/        # gRPC proto files & services
│   └── rest/        # REST API calls
├── utils/           # Utility functions
└── styles/          # Global styles
```

### Import Paths
- Use module aliases: `modules/`, `services/`, `shared/`, `utils/`
- Example: `import { Button } from 'shared/v1-components/Button'`
- Never use relative paths crossing module boundaries

---

## Common Tasks

### Working on Coin Details Page
**Location**: `src/modules/discovery/DetailView/CoinDetail/`
- Desktop: `CoinDetailsExpanded/` or `CoinDetailsCompact/`
- Mobile: `CoinDetailsMobile/`
- Components: Various widget files (`CoinWhalesWidget.tsx`, etc.)

### Finding Components
```bash
# Search for component usage
grep -r "ComponentName" src/

# Find files by pattern
find src/ -name "*keyword*"
```

### Git Workflow
```bash
# Always work on main branch
git status
git add .
git commit -m "Description"
git push origin main
```

---

## Key Project Information

**Package Manager**: Yarn (do NOT use npm for installs)
**Node Version**: 20 (specified in package.json engines)
**Framework**: React 18 + Vite
**TypeScript**: Enabled with strict mode
**Hot Reload**: Enabled (Vite HMR)

**Proto Files**: Generated TypeScript from `.proto` files
- Source: `wiserpc/proto/` (git submodule)
- Generated: `src/services/grpc/proto/`
- Regenerate: `yarn gen-proto`

---

## Rules for Claude Agents

1. **NEVER** read files from `node_modules/` or other ignored directories
2. **ALWAYS** use existing project components instead of creating new ones
3. **ALWAYS** follow project's Tailwind styling patterns
4. **ALWAYS** use TypeScript with proper types
5. **NEVER** modify generated proto files manually
6. **ALWAYS** check existing code for patterns before implementing
7. **ALWAYS** run linter before committing (`npm run lint:fix`)
8. **NEVER** install packages without user confirmation

---

Last Updated: 2026-01-07
This is a permanent reference guide - do not update with session-specific information.
