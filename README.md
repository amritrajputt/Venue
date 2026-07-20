# Venue — Event Management & RSVP Platform

**Venue** is a modern, full-stack event organization platform designed for creating, discovering, and managing free and RSVP-based community meetups and events. Built with Next.js 16, TypeScript, Drizzle ORM, PostgreSQL, and Better Auth.

---

## ⚙️ Backend Features & Architecture

* **Relational Schema & Cascading Constraints:** Designed with Drizzle ORM on PostgreSQL (Neon DB). Features strict foreign key mapping so user deletions automatically trigger cascading erasures across events and attendee registrations.
* **Event-Driven Background Workflows (Inngest):** Asynchronous event-driven job queue architecture handling background event triggers (`app/registration.confirmed`), retry logic, and 24-hour pre-event reminder scheduling.
* **Transactional SMTP Email Pipeline:** Production-ready Nodemailer email dispatch system built with STARTTLS encryption. Renders structured HTML ticket confirmations containing registration IDs, event metadata, rules, and organizer contacts.
* **Server-Side Session Authentication:** Secure authentication powered by Better Auth & Google OAuth. Implements server-side session resolution via Next.js headers validation and database-backed session adapters.
* **Real-Time SQL Query Aggregations:** Server-side SQL data aggregation (`count()`, `groupBy()`, `leftJoin()`) for real-time RSVP counts, attendance velocity tracking, and organizer analytics dashboards without data drift.
* **Optimized Media Delivery Pipeline:** Server-authenticated ImageKit API integration for secure file uploads and poster media distribution via global CDN.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack) & [React 19](https://react.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling & UI:** [Tailwind CSS v4](https://tailwindcss.com/), [Base UI](https://base-ui.com/), [Lucide Icons](https://lucide.dev/), [Phosphor Icons](https://phosphoricons.com/)
* **Database & ORM:** PostgreSQL ([Neon DB](https://neon.tech/)), [Drizzle ORM](https://orm.drizzle.team/), `pg` Pool with SSL
* **Authentication:** [Better Auth](https://www.better-auth.com/) with Google OAuth
* **Image Uploads:** [ImageKit](https://imagekit.io/) integration for event posters
* **Background Jobs & Email:** [Inngest](https://www.inngest.com/) & [Nodemailer](https://nodemailer.com/)

---

## 🚀 Getting Started

### Prerequisites

* Node.js v18+ and `pnpm`
* PostgreSQL database instance (e.g. Neon DB)
* SMTP credentials (e.g. Gmail App Password)
* Google OAuth credentials

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/venue.git
cd venue
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000

DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
NEXT_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
NEXT_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
NEXT_IMAGEKIT_ID=your_imagekit_id

INNGEST_DEV=1

SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_smtp_app_password
```

### 3. Database Migration & Push

Sync your database schema using Drizzle:

```bash
pnpm push
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Starts Next.js development server with Turbopack |
| `pnpm build` | Builds production application bundle |
| `pnpm start` | Runs production server |
| `pnpm push` | Pushes Drizzle schema directly to PostgreSQL |
| `pnpm generate` | Generates SQL migration files |
| `pnpm migrate` | Applies database migrations |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
