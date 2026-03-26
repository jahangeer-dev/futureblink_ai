# ⚡ FutureBlink AI Flow

> Visual AI prompt-response workflow — React Flow meets NVIDIA NIM

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (React)                     │
│  ┌──────────┐    ┌───────────┐    ┌──────────────────┐  │
│  │  Input   │───▶│ React Flow│───▶│   Result Node    │  │
│  │   Node   │    │  Canvas   │    │  (AI Response)   │  │
│  └──────────┘    └───────────┘    └──────────────────┘  │
│       │               │                    ▲            │
│       ▼               ▼                    │            │
│  ┌──────────┐    ┌───────────┐    ┌──────────────────┐  │
│  │  Zustand │    │  Toolbar  │    │  Socket.IO Hook  │  │
│  │  Store   │    │ (Actions) │    │  (Streaming)     │  │
│  └──────────┘    └─────┬─────┘    └────────┬─────────┘  │
│                        │                   │            │
└────────────────────────┼───────────────────┼────────────┘
                         │ REST API          │ WebSocket
                         ▼                   ▼
┌─────────────────────────────────────────────────────────┐
│                    SERVER (Express)                      │
│  ┌──────────────┐  ┌───────────┐  ┌──────────────────┐  │
│  │  AI Controller│  │  Routes   │  │  Socket Manager  │  │
│  └──────┬───────┘  └───────────┘  └────────┬─────────┘  │
│         ▼                                  ▼            │
│  ┌──────────────┐               ┌──────────────────┐    │
│  │  AI Service  │               │  Conversation    │    │
│  └──────┬───────┘               │    Service       │    │
│         ▼                       └────────┬─────────┘    │
│  ┌──────────────┐               ┌────────▼─────────┐    │
│  │  NVIDIA NIM  │               │    MongoDB       │    │
│  │   Client     │───────────▶   │  (Conversations) │    │
│  └──────────────┘               └──────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Features

- **🔗 REST API** — `POST /api/ask-ai` for AI completions via NVIDIA NIM capabilities
- **📡 WebSocket Streaming** — Real-time token streaming with Socket.IO
- **💾 MongoDB Persistence** — Save and retrieve conversations
- **⚡ React Flow** — Draggable visual node graph with animated edges
- **🎨 Dark Theme** — Hand-crafted CSS with indigo accents, smooth animations
- **🐳 AWS Ready** — Included multi-stage optimized `Dockerfile` with non-root user permissions
- **📋 Developer Experience** — Beautiful, contextual server logging built with `chalk`
- **🔒 Secure** — API keys stay server-side, never exposed to frontend

## Getting Started

### Prerequisites

- **Node.js** 20+
- **MongoDB Atlas** account (or local MongoDB)
- **NVIDIA NIM API key** — Get access to optimized NIM models at [build.nvidia.com](https://build.nvidia.com/)
- **Docker** (optional, for AWS deployment)

### 1. Clone

```bash
git clone <your-repo-url>
cd futureblink-ai-flow
```

### 2. Server Setup

```bash
cd server
cp .env.example .env
# Edit .env to add your NVIDIA_API_KEY (MongoDB URI is pre-configured)
npm install
npm run dev
```

### 3. Client Setup

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Open **http://localhost:5173** — you should see the AI Flow canvas.

---

## API Documentation

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| `POST` | `/api/ask-ai` | `{ "prompt": "string" }` | `{ status, message, data: { response, model } }` |
| `POST` | `/api/save` | `{ "prompt": "string", "response": "string" }` | `{ status, message, data: { id, prompt, response, model, createdAt } }` |
| `GET` | `/api/conversations` | — | `{ status, message, data: [...conversations] }` |

### Socket.IO Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `ai:prompt:stream` | Client → Server | `{ prompt: "string" }` |
| `ai:stream:chunk` | Server → Client | `{ chunk: "string" }` |
| `ai:stream:end` | Server → Client | `{ message: "Stream completed" }` |
| `ai:stream:error` | Server → Client | `{ error: "string" }` |

---

## Deployment

### AWS / Containerized Deployment

A production-ready `Dockerfile` is provided in the `server` directory. It uses a multi-stage Alpine build and runs the Node service strictly as a non-root user, complying with core AWS security practices.

```bash
cd server
docker build -t futureblink-ai-api .
docker run -p 5000:5000 --env-file .env futureblink-ai-api
```

### Render.com (Alternative)

1. Push `server/` to a Git repo
2. Connect to Render, select **Web Service**
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables from `.env.example`

### Frontend → Vercel

1. Push `client/` to a Git repo
2. Import in Vercel
3. Set `VITE_API_URL` to your Render backend URL
4. Deploy

---

## Environment Variables

### Server

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://jahangeer7704:Jking7704@cluster0.zr2da4s.mongodb.net/` |
| `NVIDIA_API_KEY` | NVIDIA NIM API key | `nvapi-...` |
| `NVIDIA_NIM_MODEL` | AI model ID | `meta/llama3-70b-instruct` |
| `CLIENT_URL` | Frontend URL (CORS) | `http://localhost:5173` |
| `APP_URL` | App URL | `http://localhost:5173` |
| `NODE_ENV` | Environment | `development` |

### Client

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |

---

## Author

**[@jahangeer-dev](https://github.com/jahangeer-dev)**
