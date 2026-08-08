# TIMEPASS

A real-time, iMessage-inspired chat application built with the MERN stack, Socket.IO, and Clerk authentication. Send text, images, and video to anyone on the platform, see who's online at a glance, and make the app your own with themes and wallpapers.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?logo=socketdotio&logoColor=white)](https://socket.io)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=white)](https://clerk.com)
[![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![API on Render](https://img.shields.io/badge/API-Render-46E3B7?logo=render&logoColor=white)](https://render.com)

**[Live Demo](https://timepass-delta-woad.vercel.app)** · [Report a Bug](https://github.com/Maruthi14-gif/TIMEPASS/issues) · [Request a Feature](https://github.com/Maruthi14-gif/TIMEPASS/issues)

---

## Screenshots

| Sign in | Conversations and media |
| :-----: | :---------------------: |
| ![Authentication screen](docs/screenshots/auth.png) | ![Chat interface with a shared image](docs/screenshots/chat.png) |

| Wallpapers | Accent themes |
| :--------: | :-----------: |
| ![Wallpaper picker](docs/screenshots/wallpapers.png) | ![Accent theme picker](docs/screenshots/themes.png) |

---

## Features

**Real-time messaging** — Messages are delivered instantly over a persistent WebSocket connection. No polling, no refresh.

**Presence indicators** — A live online-users map is broadcast to every connected client, so avatars show who's available right now.

**Rich media** — Share images and video up to 25 MB. Files are streamed through Multer's memory storage straight to ImageKit's CDN, so no media ever touches the app server's disk.

**Managed authentication** — Sign-up, sign-in, session management, and the user profile menu are handled by Clerk. A signed webhook keeps the MongoDB user collection in sync on every `user.created`, `user.updated`, and `user.deleted` event.

**Smart sidebar** — Two tabs, one for active conversations and one for all users on the platform. Conversations are ordered by most recent activity using a MongoDB aggregation pipeline, and both lists are searchable.

**Personalization** — Multiple HeroUI theme presets, a light/dark toggle, thirteen wallpapers, and optional keystroke sounds, all persisted locally between sessions.

**Responsive by design** — A single-pane mobile layout expands into a two-pane desktop view, driven by a `useMediaQuery` hook rather than CSS breakpoints alone.

---

## Tech Stack

### Frontend

| Technology | Purpose |
| --- | --- |
| React 19 + Vite 8 | UI library and build tooling |
| HeroUI + Tailwind CSS 4 | Component library and styling |
| Zustand | Client state, with `persist` for user preferences |
| Socket.IO Client | Real-time transport |
| Clerk React | Authentication UI and session tokens |
| Axios | HTTP client with a token-injecting interceptor |
| React Router 8 | Routing |

### Backend

| Technology | Purpose |
| --- | --- |
| Node.js + Express 5 | HTTP API |
| MongoDB + Mongoose 9 | Data persistence |
| Socket.IO | WebSocket server and presence tracking |
| Clerk Express | Token verification middleware |
| Multer | Multipart upload parsing (memory storage) |
| ImageKit | Media storage and CDN delivery |
| Cron | Keep-alive ping to prevent cold starts |

---

## Architecture

```
┌─────────────────────────┐         ┌──────────────────────────┐
│   React SPA (Vercel)    │         │      Clerk (hosted)      │
│                         │         │                          │
│  Zustand · HeroUI       │◄───────►│  Sessions · User store   │
│  Socket.IO client       │  auth   │                          │
└───────────┬─────────────┘         └────────────┬─────────────┘
            │                                    │
   REST  +  │  WebSocket                         │ signed webhook
Bearer token│                                    │ (user.created / updated / deleted)
            ▼                                    ▼
┌──────────────────────────────────────────────────────────────┐
│                  Express API (Render)                        │
│                                                              │
│  clerkMiddleware → protectRoute → controllers                │
│  Socket.IO server: userSocketMap { userId → socketId }       │
└───────────┬──────────────────────────────────┬───────────────┘
            │                                  │
            ▼                                  ▼
   ┌──────────────────┐              ┌────────────────────┐
   │  MongoDB Atlas   │              │      ImageKit      │
   │  Users, Messages │              │  Images and video  │
   └──────────────────┘              └────────────────────┘
```

**How a message travels.** The client `POST`s to `/api/messages/send/:id` with a Clerk bearer token. `protectRoute` verifies the token and resolves the Clerk ID to a MongoDB user document. If a file is attached, it is uploaded to ImageKit and the returned CDN URL is stored on the message. The message is persisted, then the server looks up the recipient's socket ID in `userSocketMap` — if they're online, a `newMessage` event is emitted directly to that socket. The sender gets the saved message back in the HTTP response.

---

## Project Structure

```
TIMEPASS/
├── backend/
│   └── src/
│       ├── controllers/      # Request handlers (auth, messages)
│       ├── lib/              # DB connection, Socket.IO, ImageKit, cron
│       ├── middleware/       # Clerk route protection, Multer upload
│       ├── models/           # Mongoose schemas (User, Message)
│       ├── routes/           # Express routers
│       ├── seeds/            # Sample user seeding script
│       ├── webhooks/         # Clerk webhook verification
│       └── index.js          # App entry point
├── frontend/
│   ├── public/               # Logo, wallpapers, keystroke sounds
│   └── src/
│       ├── components/       # auth/ and chat/ component trees
│       ├── context/          # Theme and wallpaper providers
│       ├── hooks/            # useMediaQuery, useKeyboardSound, etc.
│       ├── lib/              # Axios instance with auth interceptor
│       ├── pages/            # AuthPage, ChatPage
│       └── store/            # Zustand stores (auth, chat)
└── Dockerfile                # Multi-stage build, API serves the SPA
```

---

## Getting Started

### Prerequisites

- Node.js 22 or newer
- A MongoDB database ([Atlas](https://www.mongodb.com/atlas) free tier works)
- A [Clerk](https://clerk.com) application
- An [ImageKit](https://imagekit.io) account (optional — required only for media uploads)

### 1. Clone and install

```bash
git clone https://github.com/Maruthi14-gif/TIMEPASS.git
cd TIMEPASS

cd backend && npm install
cd ../frontend && npm install --legacy-peer-deps
```

### 2. Configure the backend

Create `backend/.env`:

```env
PORT=5176
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/timepass
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...

IMAGEKIT_PRIVATE_KEY=private_...
```

| Variable | Required | Notes |
| --- | :---: | --- |
| `PORT` | Yes | Port the API listens on. Hosts like Render inject this automatically. |
| `MONGO_URI` | Yes | MongoDB connection string. |
| `FRONTEND_URL` | Yes | Exact origin of the client. Controls CORS **and** the Socket.IO allowed origin. No trailing slash. |
| `NODE_ENV` | No | Set to `production` to enable the keep-alive cron job. |
| `CLERK_SECRET_KEY` | Yes | Used to verify session tokens server-side. |
| `CLERK_WEBHOOK_SIGNING_SECRET` | Yes | Without it the webhook returns 503 and users never sync to MongoDB. |
| `IMAGEKIT_PRIVATE_KEY` | No | Omit to run in text-only mode; media uploads return a clear 500. |

### 3. Configure the frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5176/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

> **Note:** Vite inlines `VITE_*` variables at build time, not runtime. Changing either value requires a full dev-server restart locally, or a fresh deployment in production. `VITE_API_URL` must include the `/api` suffix and must not end in a slash.

### 4. Set up the Clerk webhook

User records are created in MongoDB by webhook, not on first login — so this step is not optional. Without it, users authenticate successfully but every API call returns `404 User profile is not synced yet`.

1. In the Clerk Dashboard, go to **Webhooks → Add Endpoint**.
2. Point it at `https://<your-api-host>/api/webhooks/clerk`.
3. Subscribe to `user.created`, `user.updated`, and `user.deleted`.
4. Copy the signing secret into `CLERK_WEBHOOK_SIGNING_SECRET`.

For local development, expose your API with a tunnel (`ngrok http 5176`) and use the tunnel URL as the endpoint.

### 5. Run it

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

The app is served at `http://localhost:5173` and the API at `http://localhost:5176`. Sign in with two different accounts in two browsers to see presence and real-time delivery in action.

---

## API Reference

All routes are prefixed with `/api` and, except for the webhook and health check, require a Clerk session token in an `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Liveness probe. Returns `{ ok: true }`. |
| `GET` | `/api/auth/check` | Returns the authenticated user's MongoDB document. |
| `GET` | `/api/messages/users` | All users except the caller, for the People tab. |
| `GET` | `/api/messages/conversations` | Chat partners ordered by most recent message. |
| `GET` | `/api/messages/:id` | Full message history with one user, oldest first. |
| `POST` | `/api/messages/send/:id` | Send a message. JSON `{ text }`, or multipart with a `media` field. |
| `POST` | `/api/webhooks/clerk` | Signed Clerk user-lifecycle events. Raw body, no JSON parsing. |

### Socket events

| Event | Direction | Payload |
| --- | --- | --- |
| `connection` | Client → Server | `userId` passed via handshake query |
| `getOnlineUsers` | Server → Client | Array of online user IDs, broadcast on connect and disconnect |
| `newMessage` | Server → Client | The saved message document, emitted only to the recipient's socket |

---

## Deployment

The project deploys as a split frontend and backend, which is how the live demo runs.

**Frontend (Vercel).** Set the root directory to `frontend`. Add `VITE_API_URL` and `VITE_CLERK_PUBLISHABLE_KEY` as environment variables *before* the first build, since Vite bakes them into the bundle. Live at [timepass-delta-woad.vercel.app](https://timepass-delta-woad.vercel.app).

**Backend (Render).** Set the root directory to `backend`, build command `npm install`, start command `npm start`. Add every backend variable listed above, and set `FRONTEND_URL` to the exact Vercel URL.

Because the two live on different domains, the browser will not send Clerk's session cookie to the API. The Axios interceptor in `src/lib/axios.js` handles this by attaching the session token as a bearer header on every request.

### Single-container alternative

The included `Dockerfile` builds both halves into one image, where Express serves the compiled SPA from `public/` and the client calls `/api` on its own origin — no cross-domain concerns at all.

```bash
docker build --build-arg VITE_CLERK_PUBLISHABLE_KEY=pk_test_... -t timepass .
docker run -p 3001:3001 --env-file backend/.env timepass
```

---

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| `401 Unauthorized` on every request | The bearer token isn't reaching the API. Confirm the Axios interceptor is present and `CLERK_SECRET_KEY` is set on the server. |
| `404 User profile is not synced yet` | The Clerk webhook isn't configured or its signing secret is wrong. |
| User list is empty, requests 404 | `VITE_API_URL` is unset or missing `/api`, so calls hit the static host instead of the API. |
| CORS error in the console | `FRONTEND_URL` on the server doesn't exactly match the client origin. |
| Media upload returns 500 | `IMAGEKIT_PRIVATE_KEY` is not set. |
| First request after idle is slow | Free-tier hosts sleep. Set `NODE_ENV=production` to enable the 14-minute keep-alive cron. |

---

## Roadmap

- [ ] Group conversations
- [ ] Typing indicators and read receipts
- [ ] Message editing and deletion
- [ ] Push notifications
- [ ] Full-text message search
- [ ] Migrate to production Clerk keys

---

## License

Released under the ISC License.

## Acknowledgements

Built with [Clerk](https://clerk.com), [HeroUI](https://www.heroui.com), [ImageKit](https://imagekit.io), and [Socket.IO](https://socket.io).
