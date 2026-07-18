# Product Requirements Document (PRD)
## Venue — Event Organizer Website

**Version:** 1.0
**Status:** Draft
**Owner:** Amrit

---

## 1. Overview

Venue is a full-stack event organizer platform that lets users plan, promote, and manage events. Attendees can browse events, RSVP, and contact organizers. Organizers can create events, track RSVPs, and view engagement analytics — all with automated email notifications powered by Inngest.

## 2. Problem Statement

Existing event tools are either too heavy (built for ticketed/paid events) or too simple (just a listing page with no engagement loop). There's no lightweight platform focused purely on **free/RSVP-based events** with organizer-friendly analytics and automated communication.

## 3. Goals

- Let organizers create and manage events with minimal friction
- Let attendees discover relevant events quickly (search/filter)
- Give organizers visibility into interest/attendance via RSVP + analytics
- Keep communication automated (confirmations, reminders) via Inngest

### Non-Goals (v1)
- Paid ticketing / payment processing
- Multi-organizer team management

## 4. Target Users

| Persona | Description | Needs |
|---|---|---|
| Attendee | Browses and joins events | Fast search, easy RSVP, event reminders |
| Organizer | Creates and manages events | Simple creation flow, RSVP tracking, engagement stats |

## 5. Features (This Release)

### 5.1 RSVP System

**Problem:** Attendees need a lightweight way to confirm attendance without payment; organizers need to know headcount.

**User Stories**
- As an attendee, I want to RSVP to an event so the organizer knows I'm coming.
- As an attendee, I want to change my RSVP status if my plans change.
- As an organizer, I want to see live RSVP counts so I can gauge interest.
- As an attendee, I want a reminder email before the event so I don't forget.

**Requirements**
- RSVP options: Going, Interested, Not Going
- Live count displayed on event page
- Confirmation email on RSVP (Inngest)
- Reminder email 24 hours before event (Inngest scheduled)
- Optional capacity cap + waitlist

**Acceptance Criteria**
- [ ] User can set/change RSVP status; only one active status per user per event
- [ ] Event page reflects updated counts within a few seconds of RSVP
- [ ] Confirmation email delivered on RSVP submit
- [ ] Reminder email delivered ~24h before event start time
- [ ] Organizer can view attendee list filtered by RSVP status

---

### 5.2 Search & Filter

**Problem:** As events grow in number, attendees need to find relevant events without scrolling everything.

**User Stories**
- As an attendee, I want to search events by keyword so I find what I'm looking for fast.
- As an attendee, I want to filter by category/date/location so results are relevant.
- As an attendee, I want to share a filtered view via URL.

**Requirements**
- Keyword search (title/description)
- Filters: category, date range, location
- Sort: upcoming first, most popular (by RSVP count), newest
- Filters reflected in URL query params (shareable, back-button friendly)
- Pagination or infinite scroll

**Acceptance Criteria**
- [ ] Search returns relevant results within 300ms debounce of typing
- [ ] Combining multiple filters narrows results correctly (AND logic)
- [ ] Filter state persists on page reload via URL
- [ ] Empty state shown when no events match

---

### 5.3 Organizer Dashboard & Analytics

**Problem:** Organizers currently have no central place to manage their events or see how they're performing.

**User Stories**
- As an organizer, I want to see all my events in one place.
- As an organizer, I want to see RSVP breakdown per event.
- As an organizer, I want to see how many people viewed my event.
- As an organizer, I want to edit or cancel an event quickly.

**Requirements**
- Dashboard listing organizer's events with status (Draft/Published/Past/Cancelled)
- Per-event RSVP breakdown (Going/Interested/Not Going counts)
- View count per event
- Quick actions: Edit, Delete, Change status
- Simple RSVP trend visualization (count over time)

**Acceptance Criteria**
- [ ] Only the event's organizer can access its dashboard/analytics
- [ ] RSVP counts match actual RSVP records (no drift)
- [ ] View count increments once per unique session/view
- [ ] Dashboard loads in under 1s for organizers with <50 events

## 6. Email Templates Needed (Inngest)

1. RSVP confirmation (attendee)
2. Event reminder — 24h before (attendee)
3. Contact organizer message (organizer) — existing
4. Event update/cancellation notice (attendee) — recommended addition

## 7. Success Metrics

- % of event views that convert to RSVP
- Average RSVP count per published event
- Search-to-RSVP conversion rate
- Organizer retention (creates a 2nd event within 30 days)

## 8. Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Next.js API routes / Express
- Database: PostgreSQL
- Jobs/Email: Inngest
- Auth: existing solution (OIDC/NextAuth)

## 9. Open Questions

- Capacity limits — required for v1 or defer?
- Should "Interested" RSVPs get reminder emails too, or only "Going"?
- CSV export of attendees — needed for v1?

## 10. Milestones (Suggested)

| Phase | Scope | 
|---|---|
| Phase 1 | RSVP system + confirmation/reminder emails |
| Phase 2 | Search & filter on browse page |
| Phase 3 | Organizer dashboard + analytics |
