# 🎬 Movie Explorer

A Next.js web application for searching movies, viewing details, and managing favorites with personal ratings and notes.

---

## 🚀 Live Demo

**Hosted App:**  
https://movie-explorer-q7um94xl7-limark-dcunhas-projects.vercel.app/

---

## 📦 Setup & Run Instructions

### Prerequisites

- Node.js 18+ installed
- OMDb API key (get one free at https://www.omdbapi.com/apikey.aspx)

---

## 🧑‍💻 Local Development

### 1. Clone the repository

```bash
git clone https://github.com/limarkdcunha/movie-explorer
cd movie-explorer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory:

```env
OMDBAPIKEY=your_omdb_api_key_here
OMDBBASEURL=https://www.omdbapi.com/
```

### 4. Run the development server

```bash
npm run dev
```

### 5. Open in browser

Navigate to:

```
http://localhost:3000
```

---

# 🏗️ Technical Decisions & Tradeoffs

---

## 🔐 API Proxy Pattern

**Decision:**  
All OMDb API calls go through Next.js API routes (`/api/search`, `/api/movie`).

### Rationale

- Keeps API key secure on the server
- Prevents exposure in client-side code
- Enables server-side data enrichment (e.g., fetching plot summaries for search results)
- Allows for future caching/rate limiting without changing frontend code

### Tradeoff

- Adds slight latency vs. direct API calls
- Requires server deployment (can't be purely static)

**Conclusion:** Worth it for security and flexibility.

---

## 💾 LocalStorage for Persistence

**Decision:**  
Client-side persistence using browser LocalStorage via custom `useFavorites` hook.

### Rationale

- Zero backend infrastructure needed
- Instant persistence with no network requests
- Simple implementation meets baseline requirements
- Fast read/write operations

### Tradeoff

- Data is device-specific (no cross-device sync)
- Limited to ~5–10MB storage
- Data lost if user clears browser data

**Future Improvement:** Could migrate to a database solution for multi-device access.

---

## ⚙️ State Management

**Decision:**  
React `useState` with custom hooks; no global state library.

### Rationale

- Application is simple enough to not justify Redux/Zustand overhead
- Custom `useFavorites` hook encapsulates all favorites logic
- Props drilling is minimal due to component structure
- Keeps bundle size small

### Tradeoff

- Would need refactoring if app grows significantly
- No time-travel debugging or middleware

**Conclusion:** Appropriate for current scope.

---

## 🧩 Component Architecture

**Decision:**  
Functional components with hooks; separation between pages and reusable logic.

### Structure

```text
app/
├── page.tsx                 # Search / Home
├── movie/[id]/page.tsx      # Movie details
├── pages/favorites/page.tsx       # Favorites page
├── api/                     # Proxy routes
└── components/
    └── useFavorites/        # Shared hook
```

### Rationale

- Clear separation of concerns
- Easy to test individual pieces
- Follows Next.js App Router conventions

---

# ⚠️ Known Limitations & Future Improvements

---

## Current Limitations

### ❌ No Pagination

- Search results limited to first page (10 results)
- OMDb API returns max 10 results per query

### ❌ Limited Error Handling

- Basic error messages only
- No retry logic for failed API calls
- No network status detection

### ❌ No Search History

- Previous searches aren't saved
- No autocomplete suggestions

### ❌ Single User

- LocalStorage is per-device
- No user accounts or authentication

### ❌ Basic UI Polish

- No loading skeletons during search
- No advanced image lazy loading optimization
- Mobile experience could be more refined

---

# 🚀 With More Time, I Would Add

---

## 🔥 High Priority

### Pagination / Infinite Scroll

- Fetch and display more than 10 results
- Implement "Load More" or infinite scroll pattern

### Enhanced Search

- Filter by year, genre, rating
- Sort options (relevance, rating, year)
- Search history with LocalStorage

### Improved Data Fetching & Caching

- Use a dedicated fetching library such as `useQuery` (TanStack Query)
- Built-in caching, background refetching, and request deduplication
- Cleaner separation between UI and server state logic

### Server-Side Persistence

- Migrate to PostgreSQL or MongoDB
- Add user authentication (NextAuth.js)
- Enable cross-device favorites sync

### Code Quality Improvements

- Improve naming consistency across components and hooks
- Break down large components into smaller reusable components
- Extract reusable logic into custom hooks where appropriate
- Improve folder structure for scalability
- Add stricter TypeScript types and better error boundaries

### Better UX

- Loading skeletons for search results
- Optimistic UI updates for favorites
- Toast notifications for actions
- Empty state illustrations

### Performance Improvements

- Image optimization and CDN usage
- Request debouncing for search input

---

## ✨ Nice to Have

- Movie recommendations based on favorites
- Share favorite lists via link
- Export favorites as JSON/CSV
- Dark mode support
- Keyboard shortcuts for navigation
- Unit tests (Jest + React Testing Library)
- E2E tests (Playwright)
- PWA support for offline access

---

# 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **API:** OMDb API
- **Deployment:** Vercel
- **Storage:** Browser LocalStorage
