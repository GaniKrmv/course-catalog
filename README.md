# Course Catalog — Lab 5

Next.js 16.3.4 frontend connected to the FastAPI course catalog. Course pages load data on the Next.js server; the SWR filter, like button and enrollment form call FastAPI directly from the browser.

## Run both projects on Windows

Use Node.js 20+ and Python 3.10+. Start the backend first in a PowerShell terminal:

```powershell
cd "C:\Users\user\Desktop\новый\course-catalog-api"
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\fastapi.exe dev main.py --port 8000
```

In a second terminal:

```powershell
cd "C:\Users\user\Desktop\новый\course-catalog"
npm install
npm run dev -- --port 3000
```

Create `.env.local` beside `package.json` before starting Next.js:

```dotenv
API_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

`API_URL` is read only by server code. `NEXT_PUBLIC_API_URL` is embedded in browser JavaScript at build time and must contain no secrets. Restart the dev server after initially creating the file; rebuild production after changing a public variable. `.env.local` is excluded by `.gitignore` and is not committed.

Open **http://localhost:3000/courses**, **http://localhost:3000/filter** and **http://localhost:8000/docs**. Use localhost and port 3000 exactly: 127.0.0.1 or a different port is a different origin. Stop an old instance before starting another on the same port. Likes and enrollments live in backend memory and reset when it restarts.

## Decisions

`generateStaticParams` was removed because it called the API during the build, making the build depend on a running backend and a fixed set of course IDs. `getCourses` and `getCourse` use `cache: "no-store"` and check `res.ok`; a course 404 returns `undefined` and triggers `notFound()`. Both course routes render dynamically and `npm run build` succeeds with FastAPI stopped.

A like is a simple POST without a body or special headers, so it needs no preflight. Enrollment sends `Content-Type: application/json`, so the browser sends OPTIONS before POST; CORSMiddleware allows the origin, method and header. CORS controls whether browser JavaScript can read the response: a blocked simple POST can still change the server state.

The form deliberately has no client-side minimum length, so a one-letter name reaches FastAPI and its 422 validation message is displayed. `error.tsx` uses Next.js 16.3's `retry()` to fetch again after a backend failure; `reset()` alone would only re-render the existing boundary.

## Verification

Verified locally on 15 October 2026 using Chrome browser automation, the real Next.js production server and FastAPI. Production mode avoids the Next.js development-origin restriction in the foreign-host experiment; when reproducing that experiment with `npm run dev`, temporarily add `allowedDevOrigins: ["127.0.0.1"]` to `next.config.ts`, restart Next.js, then remove it afterward. Browser requests and errors were recorded through Chrome's Network/Console protocol with cache disabled.

- Six server-rendered cards; ai-integration first; no browser API GET for /courses.
- SWR filter: six -> two electives -> six.
- Two likes persist after reload; A -> 422 message; Aigerim -> enrollment 1; OPTIONS for enrollment only.
- Unknown course -> not-found.
- Backend stopped -> error boundary; restarted -> retry restores cards without reload.
- Delayed backend -> existing course loading UI -> course.
- Production build succeeds while the backend is stopped; `/courses` and `/courses/[id]` are dynamic.
- Backend contract checks cover CORS, preflight, camelCase, electives, sort/pagination, 404/422 and enrollment creation.

For loading verification only, a two-second delay was injected into `get_course`; it is absent from the final backend. Each breakage below was tested in an isolated backend process with one altered copy of the application source in memory; the files in the working repository remained correct.

## Breakage journal

The diagnostic order was: (1) request URL and presence, (2) status/body, (3) response CORS headers, (4) OPTIONS, (5) backend traceback. A browser CORS failure is shown below as `net::ERR_FAILED`; underlying HTTP statuses were checked against the backend response/log, because JavaScript cannot read the blocked response. A failed POST entry after a rejected preflight represents a blocked browser request, not a POST executed by FastAPI.

### Breakage 1: CORS middleware removed

- What I did: `app.add_middleware(CORSMiddleware, ...)` → the entire block removed.
- Console: `Access to fetch at 'http://localhost:8000/courses' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`
- Network: GET /courses and POST /courses/web-security/like: browser CORS failure (underlying HTTP 200); OPTIONS /enrollments: 405; enrollment POST not sent. The server-rendered /courses page still works.
- Server preflight: **405**, body `{"detail":"Method Not Allowed"}`.
- Cause: No Access-Control-Allow-Origin header is present because CORS middleware is absent. The like still executes on the server.
- How I found it: Steps 3 and 4: missing permission header and OPTIONS 405 identify absent middleware.
- Fix: restore the working middleware/origin/methods, open the frontend using localhost, or restore the correct `offset` key respectively. Each experiment ended before the next began; no experimental changes remain in the project files.

### Breakage 2: Trailing slash in allowed origin

- What I did: `allow_origins=["http://localhost:3000"]` → `allow_origins=["http://localhost:3000/"]`.
- Console: `Access to fetch at 'http://localhost:8000/courses' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`
- Network: GET /courses and like: browser CORS failure (underlying HTTP 200); OPTIONS /enrollments: 400; POST not sent. /courses still works.
- Server preflight: **400**, body `Disallowed CORS origin`.
- Cause: The origin with a trailing slash does not match the browser Origin. No Access-Control-Allow-Origin is returned.
- How I found it: Steps 3 and 4: compare exact origins; preflight body is Disallowed CORS origin, distinguishing this case from the 405 in experiment 1.
- Fix: restore the working middleware/origin/methods, open the frontend using localhost, or restore the correct `offset` key respectively. Each experiment ended before the next began; no experimental changes remain in the project files.

### Breakage 3: Allowed methods omitted

- What I did: `allow_methods=["*"]` → line removed, leaving the default GET-only preflight policy.
- Console: `Access to fetch at 'http://localhost:8000/enrollments' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.`
- Network: GET /courses: 200; like POST: 200 without OPTIONS; enrollment OPTIONS: 400; enrollment POST not sent. /courses still works.
- Server preflight: **400**, body `Disallowed CORS method`.
- Cause: Simple requests succeed, but the JSON enrollment preflight requests POST while the response only allows GET. Access-Control-Allow-Origin is present.
- How I found it: Step 4: OPTIONS body is Disallowed CORS method; Access-Control-Allow-Methods is GET.
- Fix: restore the working middleware/origin/methods, open the frontend using localhost, or restore the correct `offset` key respectively. Each experiment ended before the next began; no experimental changes remain in the project files.

### Breakage 4: Frontend opened through 127.0.0.1

- What I did: Backend unchanged; page address `http://localhost:3000/filter` → `http://127.0.0.1:3000/filter`.
- Console: `Access to fetch at 'http://localhost:8000/courses' from origin 'http://127.0.0.1:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`
- Network: Filter GET and like: browser CORS failure (underlying HTTP 200); enrollment OPTIONS: 400; enrollment POST not sent. The server-rendered /courses page still works.
- Server preflight: **400**, body `Disallowed CORS origin`.
- Cause: http://127.0.0.1:3000 and http://localhost:3000 are different origins even though both reach the same computer. The allowed origin header is missing.
- How I found it: Steps 1 and 3: compare the page origin and request Origin with allow_origins; OPTIONS confirms Disallowed CORS origin.
- Fix: restore the working middleware/origin/methods, open the frontend using localhost, or restore the correct `offset` key respectively. Each experiment ended before the next began; no experimental changes remain in the project files.

### Breakage 5: Python error masquerading as CORS

- What I did: `offset, limit = p["offset"], p["limit"]` → `offset, limit = p["ofset"], p["limit"]`.
- Console: `Access to fetch at 'http://localhost:8000/courses' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`
- Network: Filter GET: browser CORS failure, underlying HTTP 500; like: 200; enrollment OPTIONS: 200, POST: 201. The server-rendered /courses page displays the error boundary.
- Server preflight: **200**, body `OK`.
- Cause: KeyError: 'ofset' in list_courses produces an unhandled HTTP 500 outside CORSMiddleware, so its response lacks Access-Control-Allow-Origin. Other routes and their CORS permissions remain correct.
- How I found it: Steps 2 and 5: direct GET returns 500 and the backend traceback ends in KeyError: 'ofset'. Fix the dictionary key rather than CORS.
- Fix: restore the working middleware/origin/methods, open the frontend using localhost, or restore the correct `offset` key respectively. Each experiment ended before the next began; no experimental changes remain in the project files.

## Local checks and submission

```powershell
npm run lint
npm run build
```

To check the production build, stop the dev server, run `npm run start -- --port 3000` and keep FastAPI running for runtime requests. FastAPI is not needed during the build itself.

The frontend has separate local Lab 5 commits for API reads, removal of static params, loading/error recovery, SWR filtering, likes/enrollment and documentation. Submit both existing repositories after pushing the commits through your own GitHub access:

- Frontend: https://github.com/GaniKrmv/course-catalog
- Backend: https://github.com/37423iitu/course-catalog-api

These links are the configured remotes; local completion does not mean the new commits have already been published.
