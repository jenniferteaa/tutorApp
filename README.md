### Tutor-ai (Tutor)

Tutor-ai is a Chrome extension + backend + workspace that turns LeetCode practice into guided learning. It adds a floating widget and tutor panel on problem pages, lets you ask questions about your code, runs check/guide modes, and stores structured notes in Supabase. A separate workspace app lets users review topics, attempts, and summaries.

### Demo
![tutor-ai-demo](https://github.com/user-attachments/assets/348b7c3b-43f1-44be-b5cb-a2a5e737fdc1)

### Full Demo
[Click here to watch the full demo video](https://drive.google.com/file/d/1wahWDHVtSgTqqDm3PgWYByOzhrQfjrZ3/view)

### Workspace
[TutorAI](https://tutor-app-kappa-weld.vercel.app/login)


### How to use it?
- Download the Chrome extension (available soon) from the workspace page.
- Open any LeetCode problem - the extension activates automatically.
- **Guide mode**: Provides incremental nudges as you write code. The panel can be closed while coding - feedback continues to accumulate for later review.
- **Check mode**: Invoke after completing your solution. Returns structured feedback on correctness and reasoning.
- **Notes made**: View the key learnings and generalized pitfalls extracted during your session. Organized by topic for quick and efficient review.

**Features**
- Floating widget and tutor panel on LeetCode `/problems/*` pages
- Ask Anything: ask about your current code
- Check Mode: full review + corrected code + structured notes
- Guide Mode: incremental nudges while you code, buffered in Redis, flushed on disable
- Notes + summaries in a dedicated workspace UI
- Auth bridge from extension to workspace

**Architecture**
- Extension (WXT + React): content script UI + background actions
- Backend (FastAPI): LLM calls, Redis buffering, Supabase writes
- Workspace (Next.js): notes UI, summaries, attempts

**Project Structure**
- `entrypoints/` extension source (content, background, popup)
- `backend/` FastAPI service
- `workspace/` Next.js app
- `assets/` static assets for the extension

**Local Development**
1. Install dependencies (root for extension).
```bash
npm install
```
2. Run the extension dev build.
```bash
npm run dev
```
3. Start backend (from `backend/`).
```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
4. Start workspace (from `workspace/`).
```bash
npm install
npm run dev
```

**Required Configuration**

Backend env (Render or `backend/.env`):
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `REDIS_URL`
- `CORS_ALLOW_ORIGINS` (comma-separated)

Optional backend env:
- `SESSION_STATE_TTL_SECONDS`
- `BACKEND_TOKEN_TTL_SECONDS`
- `BRIDGE_CODE_TTL_SECONDS`
- `BRIDGE_RATE_LIMIT_IP`
- `BRIDGE_RATE_LIMIT_USER`
- `BRIDGE_RATE_LIMIT_WINDOW_SECONDS`

Workspace env (`workspace/.env.local`):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `BACKEND_BASE_URL`

Extension constants:
- `entrypoints/background/core/constants.ts` → `BACKEND_BASE_URL`
- `entrypoints/content/index.ts` → `WORKSPACE_URL` (auth bridge URL)

**Deployment**
- Backend: Render (FastAPI + Redis)
- Workspace: Vercel (Next.js)
- Extension: `npm run build` → upload `chrome-mv3/` to Chrome Web Store

**Troubleshooting**
- Guide mode 500s usually mean Redis is not reachable. Check `REDIS_URL`.
- Check/Guide timeouts are controlled by `REQUEST_TIMEOUT_MS` in `entrypoints/background/core/constants.ts`.
- If the panel is empty after navigation, verify the problem URL and session persistence logic.
