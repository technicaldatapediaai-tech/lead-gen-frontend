# Lead Genius SaaS - Frontend

This is the frontend dashboard for Lead Genius, built with **Next.js 16**.

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide React, Custom Components
- **State Management**: React Context / Hooks
- **Form Handling**: React Hook Form + Zod

## 🚀 Setup & Installation

### 1. Prerequisites

- Node.js 18.17+ 
- npm, yarn, pnpm, or bun

### 2. Installation

1.  Navigate to `Lead-Genius-Saas/`:
    ```bash
    cd Lead-Genius-Saas
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### 3. Configuration (`.env.local`)

Create a `.env.local` file in the root of `Lead-Genius-Saas/` to store environment variables.

**Example Variables:**

```ini
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Running Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable React components (UI library, feature-specific).
- `lib/`: Utility functions and shared logic.
- `public/`: Static assets (images, fonts).
- `styles/`: Global styles (if any).

## 📦 Building for Production

To create a production build:

```bash
npm run build
npm start
```

## 📝 Notes

- **API Integration**: The frontend communicates with the Backend API (likely proxied or direct calls). Ensure the backend is running on `http://localhost:8000` (or configured URL).
- **Authentication**: JWT tokens are likely stored in cookies or local storage. Check `app/providers` or `contexts` forauth logic.
