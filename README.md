# Venue - Event Organisation Platform

Venue is a modern full-stack web application designed for event organization, RSVP management, and communication automation. It features a sleek glassmorphic design, custom interactive animations, automatic dark/light mode scheduling, and a relational PostgreSQL database schema.

---

## 🚀 Key Features

*   **Responsive Landing Page:** Fully interactive layout featuring responsive grids, customized Lucide icons, and backdrop-blur navigation overlays.
*   **Wavy Canvas Text Animation:** Dynamic canvas rendering of the hero target headers using canvas-masked wave animations with custom colors.
*   **Global Text Selection Guard:** Integrated `select-none` utility rules for container interactions to prevent accidental highlights and drag-drops, keeping the visual experience premium.
*   **Custom Favicon & Logos:** High-resolution favicon metadata mapping (`4085.jpg`) and custom circular cropping on navigation headers.
*   **Cascading Relational Schema:** Configured with PostgreSQL constraints via Drizzle ORM to ensure deletion of users automatically cascades to erase related events and event registrations (attendees).

---

## 🛠️ Tech Stack

*   **Core:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Database ORM:** [Drizzle ORM](https://orm.drizzle.team/) & [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)
*   **Database Driver:** PostgreSQL with `pg` (node-postgres)
*   **Authentication:** [Better Auth](https://www.better-auth.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)

---

## ⚙️ Development Commands

Ensure you have your environment variables set up in a local `.env` file containing your `DATABASE_URL` link.

### 1. Run Development Server
```bash
pnpm dev
```

### 2. Generate Drizzle Database Migrations
Detects changes inside `schema.ts` and creates a local SQL migration script in `./drizzle`:
```bash
pnpm generate
```

### 3. Apply Migrations to PostgreSQL
Executes pending database updates securely:
```bash
pnpm migrate
```

### 4. Direct Drizzle Schema Push
Syncs the PostgreSQL schema directly without generating incremental SQL migration scripts:
```bash
pnpm push
```

### 5. Production Build
```bash
pnpm build
```
