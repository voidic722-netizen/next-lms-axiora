# LMS Frontend

A Learning Management System (LMS) frontend built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

## Tech Stack

- **Framework** – Next.js 16 (App Router)
- **Language** – TypeScript (strict mode)
- **Styling** – Tailwind CSS v4
- **UI Components** – Radix UI primitives + Lucide icons
- **Form Handling** – React Hook Form + Zod
- **Server State** – TanStack React Query v5
- **State Management** – Zustand
- **HTTP Client** – Axios
- **Mocking** – MSW (Mock Service Worker)
- **Notifications** – Sonner

## Features

- **Authentication** – Session-based login via Laravel backend
- **Role-based Access** – Admin, Teacher, and Student dashboards
- **Classroom Management** – CRUD and enrollment
- **Assignments** – Create, submit, and grade
- **Exams** – Schedule, take, and review
- **Schedules** – Class and exam scheduling
- **Departments & Faculties** – Organizational hierarchy
- **Semesters & Subjects** – Academic period and course management
- **User Management** – Admin panel for user administration
- **MSW Mocking** – Development with mock data support

## Getting Started

### Prerequisites

- Node.js >= 20
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Copy the example env file and adjust values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL (default `http://localhost:8000/api`) |
| `NEXT_PUBLIC_STORAGE_URL` | Storage base URL for media assets |
| `API_URL` | Internal API URL (same as public unless behind a proxy) |
| `SESSION_COOKIE_NAME` | Laravel session cookie name (default `laravel_session`) |

### Development

```bash
npm run dev          # Start dev server (no mock)
npm run dev:mock     # Start dev server with MSW mocking
```

### Build

```bash
npm run build        # Production build
npm run start        # Start production server
```

### Lint & Type Check

```bash
npm run lint         # ESLint
npm run type-check   # TypeScript type checking
```

## Project Structure

```
├── app/                   # Next.js App Router pages
│   ├── (auth)/            # Login & authentication pages
│   ├── (protected)/       # Protected pages (admin, teacher, student)
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── layout/            # Layout components (sidebar, navbar)
│   ├── shared/            # Shared components
│   └── ui/                # Base UI primitives (shadcn-style)
├── constants/             # App-wide constants
├── features/              # Feature-based modules (actions, hooks)
├── hooks/                 # Shared hooks
├── lib/                   # Utilities (axios instance, helpers)
├── providers/             # React context providers
├── services/              # API service layer
├── stores/                # Zustand stores
├── types/                 # TypeScript type definitions
└── utils/                 # Formatting & sorting utilities
```
