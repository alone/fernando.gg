# fernando.gg

My personal portfolio and blog — a fullstack monorepo powered by Bun.

## Features

- **Blog** — Posts are written in Markdown and stored in a GitHub repo. Content is fetched via the GitHub API, processed with a unified/remark/rehype pipeline (GFM, syntax highlighting, auto-linked headings), and cached in-memory with a 5-min TTL.
- **Projects** — Showcase of my work with filtering by tag and tech stack, pagination, and links to source/live demos.
- **Admin panel** — Protected area to create, edit, and delete blog posts and projects. Includes drag-and-drop image uploads to S3-compatible storage.
- **Auth** — Email/password authentication via Better Auth with session cookies. Admin access is restricted by username.

## How it works

The frontend is a React SPA with file-based routing (TanStack Router). It talks to the backend through end-to-end type-safe tRPC calls.

The backend is a plain `Bun.serve` HTTP server that handles two route trees: `/api/auth/*` for Better Auth and `/trpc/*` for tRPC. Blog content lives as `.md` files in a GitHub repo — the API fetches and caches them on demand, so publishing a post is just pushing a Markdown file.

Data (posts metadata, projects, users, sessions) lives in PostgreSQL, managed with Drizzle ORM. Images are uploaded to S3-compatible storage.

Deployment is automated via GitHub Actions: push to `master` triggers type-checking, then SSH-deploys to a VPS.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TanStack Router, TanStack Query, Vite, TailwindCSS, Framer Motion |
| Backend | Bun.serve, tRPC |
| Database | PostgreSQL, Drizzle ORM |
| Auth | Better Auth |
| Storage | S3-compatible (images) + GitHub (blog content) |
| Monorepo | Turborepo, Bun workspaces |
| CI/CD | GitHub Actions, SSH deploy |
| Tooling | Biome, Husky |

## Project Structure

```
apps/
├── web/         # Frontend (React + TanStack Router)
└── server/      # Backend API (Bun.serve + tRPC)
packages/
├── api/         # tRPC routers & business logic
├── auth/        # Better Auth configuration
└── db/          # Drizzle schema & database access
```

## Live

[https://fernando.gg](https://fernando.gg)
