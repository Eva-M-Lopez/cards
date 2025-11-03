# COP4331 MERN Project

Monorepo containing web and mobile applications with shared business logic.

## Project Structure

```
cards/
├── frontend/          # React web application
├── backend/           # Node.js backend server
├── mobile/            # React Native mobile app (Expo)
├── shared/            # Shared code between web and mobile
└── package.json       # Root workspace configuration
```

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher) for workspace support
- Docker & Docker Compose (for web/backend)
- Android Studio (for Android development)
- Xcode (for iOS development, Mac only)
- Expo Go app on your phone (optional, for quick testing)

## Getting Started

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Eva-M-Lopez/cards.git
   cd cards
   ```

2. **Install all dependencies**
   ```bash
   npm install
   ```
   This will install dependencies for all workspaces (frontend, backend, mobile, shared).

### Running the Applications

#### Web Application (with Docker)

```bash
docker-compose up frontend backend
```

Or without Docker:
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Access at: `http://localhost:5173` (or your configured port)

#### Mobile Application

```bash
cd mobile
npm start
```

Then choose how to run:
- Press `a` - Open on Android emulator
- Press `i` - Open on iOS simulator (Mac only)
- Press `w` - Open in web browser
- Scan QR code with Expo Go app on your phone

### Development Workflow

#### Working on Web
1. Start Docker containers or run frontend/backend locally
2. Make changes in `frontend/` or `backend/`
3. Hot reload will update automatically

#### Working on Mobile
1. Start Expo dev server: `cd mobile && npm start`
2. Make changes in `mobile/`
3. App will reload automatically

#### Working with Shared Code
1. Edit files in `shared/src/`
2. Export from `shared/src/index.ts`
3. Both web and mobile will pick up changes automatically
4. May need to restart dev servers if changes don't appear

## Workspace Structure

### Frontend (`frontend/`)
React web application with:
- Web-specific UI components
- React Router for navigation
- Web pages and layouts
- CSS/styled-components

### Backend (`backend/`)
Node.js server with:
- API endpoints
- Database connections
- Business logic
- Authentication

### Mobile (`mobile/`)
React Native (Expo) application with:
- Mobile-specific UI components
- React Navigation
- Mobile screens
- Platform-specific features

### Shared (`shared/`)
Code shared between web and mobile:
- TypeScript types and interfaces
- API client/services
- Utility functions
- Constants and configuration
- State management (Redux/Zustand)
- Business logic

**Structure:**
```
shared/src/
├── types/        # TypeScript types
├── api/          # API client and services
├── utils/        # Utility functions
├── constants/    # App constants
└── index.ts      # Main export file
```

**Usage:**
```typescript
// In frontend or mobile
import { User, apiClient, formatDate } from '@cards/shared';
```
**Note:** Note: The `shared` workspace is published internally under the scoped name `@cards/shared`.
This scoped name ensures consistent imports across projects and allows npm workspaces to link it locally instead of fetching it from the public registry.

## Common Commands

### Root Level
```bash
npm install                    # Install all workspace dependencies
npm run dev:web               # Start frontend
npm run dev:mobile            # Start mobile
npm run dev:backend           # Start backend
```

### Frontend
```bash
cd frontend
npm run dev                   # Start dev server
npm run build                 # Build for production
npm run test                  # Run tests
```

### Mobile
```bash
cd mobile
npm start                     # Start Expo dev server
npm run android               # Run on Android
npm run ios                   # Run on iOS
```

### Backend
```bash
cd backend
npm start                     # Start server
npm run dev                   # Start with hot reload
```

### Shared
```bash
cd shared
npm run type-check            # Check TypeScript types
```

## Adding Dependencies

### To a specific workspace
```bash
# From root
npm install <package> --workspace=frontend
npm install <package> --workspace=mobile
npm install <package> --workspace=shared
```

### To shared package
```bash
cd shared
npm install <package>
```

Then make sure frontend and mobile have shared as a dependency:
```json
{
  "dependencies": {
    "@cards/shared": "*"
  }
}
```

## Testing

### Web Testing
```bash
cd frontend
npm run test
```

### Mobile Testing
- Use Expo Go app on physical device (recommended)
- Use Android Studio emulator
- Use Xcode iOS simulator (Mac only)

**Note:** Docker is not used for mobile testing due to limitations with emulators and native features.

## Building for Production

### Web
```bash
cd frontend
npm run build
```

### Mobile
```bash
# Local builds
cd mobile
npx expo run:android
npx expo run:ios

# Cloud builds with EAS
npx eas-cli build --platform android
npx eas-cli build --platform ios
```

## Troubleshooting

### "Cannot find module '@cards/shared'"
If you see this or a similar error during npm install:
```bash
npm ERR! 404 Not Found - GET https://registry.npmjs.org/@cards%2fshared
```

Make sure that:
1. The `shared/package.json` file includes:
```json
"name": "@cards/shared",
"private": true
```
2. You’re running installs from the repo root (not inside subfolders):
```bash
# From root
npm install
```
npm workspaces automatically symlink @cards/shared into the web and mobile projects when the names match.


### Web app won't start
```bash
# Check Docker containers
docker-compose ps

# Or restart containers
docker-compose down
docker-compose up
```

### Mobile app won't connect to backend
- Make sure backend is running
- Update API URL in `shared/src/constants/index.ts`
- For physical device, use your computer's IP instead of localhost

### Changes in shared/ not appearing
```bash
# Restart the dev server
cd frontend  # or mobile
# Stop with Ctrl+C, then restart
npm run dev  # or npm start
```

### VS Code not recognizing imports
- Reload VS Code: `Cmd/Ctrl + Shift + P` → "Reload Window"
- Check that workspace is installed: `npm install` from root

## Git Workflow

```bash
# Create feature branch
git checkout -b yourname-feature-description

# Make changes to any workspace
# Commit and push
git add .
git commit -m "Description of changes"
git push origin yourname-feature-description
```

## Project Architecture Decisions

### Why Monorepo?
- Share code between web and mobile
- Atomic changes across platforms
- Consistent versioning
- Single source of truth for types and API client

### Why Separate mobile/ instead of merging with frontend/?
- Different build tools (Vite/Webpack vs Metro)
- Different component libraries (React vs React Native)
- Independent release cycles
- Clear separation of concerns

### What goes in shared/?
✅ API calls, types, utilities, constants, business logic
❌ UI components, routing, platform-specific code, styling

## Resources

- [React Documentation](https://react.dev)
- [React Native Documentation](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [npm Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)

