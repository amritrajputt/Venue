# Venue — Event Management & RSVP Platform

**Venue** is a modern, full-stack event organization platform designed for creating, discovering, and managing free and RSVP-based community meetups and events. Built with Next.js 16, TypeScript, Drizzle ORM, PostgreSQL, and Better Auth.

---

## 🌟 Key Features

* **Event Discovery & Exploration:** Browse upcoming public community events, workshops, and meetups with live attendee counters, host information, and modal registration flows.
* **Seamless RSVP & Registration:** Attendees can register for events instantly. Prevents double-registration and handles attendee capacity metrics.
* **Automated Email Confirmations:** Dispatches instant ticket/registration confirmation emails to attendees with event details, rules, and entry guidelines using Nodemailer & background workflows.
* **Organizer Dashboard:** Complete organizer suite to publish new events with ImageKit poster uploads, toggle public/private visibility, edit event details, and delete events.
* **Live Analytics & Breakdown:** Performance metrics tracking total events hosted, total registrations, average attendance size, and detailed event-by-event breakdowns.
* **Google Social Authentication:** Secure user authentication powered by Better Auth supporting Google OAuth login and session management.
* **Responsive & Customizable Design System:** Crafted with Tailwind CSS v4, Base UI, dark/light mode toggle, canvas wave text animations, and glassmorphic cards tuned to a unified primary color palette.

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
