# AI Assessment Creator - VedaAI

An AI-powered assessment creator designed to automate the process of generating question papers. Built with an exact match of the provided Figma designs, featuring glassmorphic effects, modern typography, and robust backend architecture.

## Architecture Overview

### Frontend
- **Framework**: Next.js (App Router) + TypeScript
- **State Management**: Redux Toolkit for complex assignment arrays, Zustand/React state for local form data.
- **Styling**: Vanilla CSS (CSS Modules & Global CSS) with rich aesthetics, gradients, and micro-animations as required—completely avoiding Tailwind CSS.
- **Real-time**: `socket.io-client` for listening to background job updates.

### Backend
- **Framework**: Node.js + Express + TypeScript
- **Database**: MongoDB (via Mongoose) to store assignment configurations and generated output.
- **Queue/Background Jobs**: Redis + BullMQ for handling asynchronous LLM generation to prevent timeout issues on long context generation.
- **Real-time**: `socket.io` server bound to the Express app.
- **AI Integration**: Google GenAI SDK (`@google/genai`) parsing structured prompts to return clean JSON formats.

## Approach

1. **Robust UI Mapping**: The UI strictly follows the Figma designs, providing a seamless "Empty State" all the way to a "Filled Dashboard" and an interactive "Assignment Details" multi-step flow.
2. **Background Processing**: Because LLMs can take 10-30 seconds to generate a full question paper, the generation occurs inside a BullMQ worker. The frontend immediately reflects a "generating..." state using WebSockets.
3. **Structured Generation**: The worker passes a strict JSON schema prompt to the LLM. It parses the resulting markdown to ensure it extracts valid JSON representing `Sections`, `Questions`, `Difficulty`, and `Marks`.
4. **Client-side PDF Exporter**: Clean printable CSS `@media print` is used alongside the native browser `window.print()` functionality to retain layout while hiding sidebar elements.

## Setup Instructions

### Prerequisites
1. Node.js (v18+)
2. MongoDB running locally on `27017`
3. Redis running locally on `6379`
   - *A `docker-compose.yml` is provided at the root to spin these up quickly.*

### Environment Variables
Inside `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vedaai
REDIS_URI=redis://localhost:6379
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### Installation

1. Start databases:
```bash
docker-compose up -d
```

2. Start the Backend:
```bash
cd backend
npm install
npm run dev
```

3. Start the Frontend:
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to start creating AI assignments.
