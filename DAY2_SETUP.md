# DSA DryRun - Day 2 Development Setup Guide

## ✅ Day 2 Complete - Dev Environment Verified

All core services are set up and tested:

### Services Status
- ✅ **Express Server** - Running on port 3001, health endpoint responding
- ✅ **React + Vite Client** - Builds successfully, dev server ready
- ✅ **Node.js Dependencies** - Installed for both server and client
- ✅ **Environment Configuration** - .env file created from template

---

## Development Workflow

### Option 1: Local Development (No Docker)

**Terminal 1 - Start Server:**
```bash
cd server
npm start
# Server runs on http://localhost:3001
```

**Terminal 2 - Start Client Dev Server:**
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

### Option 2: Docker Compose (Requires Docker)

```bash
docker-compose up
# All services: PostgreSQL, Redis, Server, Client
# Server: http://localhost:3001
# Client: http://localhost:5173
```

---

## Current Architecture

```
DSA-Dryrunner/
├── server/              # Express monolith
│   ├── index.js        # Basic app with health endpoint
│   ├── package.json    # Dependencies: express, cors, dotenv, pg
│   └── Dockerfile      # For containerization
├── client/              # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json    # Dependencies: react, react-dom
│   └── Dockerfile      # For containerization
├── docker-compose.yml   # Dev environment orchestration
└── .env                # Environment configuration
```

---

## Next Steps (Days 3-4)

Ready to move to **Days 3-4: Problems API + Database Schema**

Tasks will include:
- Create PostgreSQL schema (problems table, test_cases table)
- Build REST API endpoints: `GET /api/problems`, `POST /api/problems/:id/submit`
- Connect Express server to PostgreSQL
- Seed database with 10 starter problems

---

## Troubleshooting

**Server won't start:**
- Check port 3001 is free: `lsof -i :3001`
- Verify .env file exists in project root
- Run `npm install` in server directory

**Client won't start:**
- Check port 5173 is free: `lsof -i :5173`
- Run `npm install` in client directory
- Try: `npm run dev -- --host`

**Docker issues:**
- Ensure Docker Desktop is running
- Clean up: `docker-compose down -v`
- Rebuild: `docker-compose up --build`

---

## Testing the Setup

### Verify Server
```bash
curl http://localhost:3001/health
# Expected response: {"status":"Server is running"}
```

### Verify Client Build
```bash
cd client
npm run build
# Should create dist/ folder with optimized build
```

---

## Database Connection

The server is pre-configured to connect to PostgreSQL:
- **Host**: postgres (docker) or localhost (local)
- **Port**: 5432
- **Database**: dsadryrun
- **User**: dev
- **Password**: dev

When Redis/PostgreSQL services start, update connection logic in server routes.
