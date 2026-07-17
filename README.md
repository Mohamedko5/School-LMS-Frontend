# EduBridge School LMS

EduBridge School LMS is a frontend-only React prototype for a modern school learning management system. It includes demo portals for students, teachers, parents, and school administrators.

## Technology Stack

- React.js with Vite
- Tailwind CSS
- React Router DOM
- Lucide React Icons
- Framer Motion
- Recharts
- date-fns
- LocalStorage for mock authentication, theme, and saved demo data

## Run Locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Demo Login

Use any non-empty username and password. Select one of these roles:

- Student
- Teacher
- Parent
- School Admin

The selected role is saved in LocalStorage and redirects to the matching dashboard. The profile area includes a demo role switcher.

## Main Features

- Public landing, login, forgot password, and 404 pages
- Protected role-based routes
- Responsive sidebar, mobile drawer, and mobile bottom navigation
- Student courses, lessons, assignments, quizzes, grades, attendance, calendar, resources, profile, and achievements
- Teacher course management, lesson and assignment forms, quiz builder, submissions, gradebook, attendance, students, messages, and announcements
- Parent dashboard, child progress, attendance, announcements, calendar, and messages
- Admin dashboard, user management, add student form, academic structure, reports, audit log, announcement management, and settings
- Working dark mode, filters, search fields, tabs, modals, file upload preview, quiz navigation, attendance editing, and local saved state

## Folder Structure

```text
src/
  components/
    common/
    layout/
  data/
  pages/
  routes/
  utils/
  App.jsx
  main.jsx
  index.css
```

## Prototype Notes

This project does not use a backend, Firebase, Supabase, or an external database. All content is mock data stored in JavaScript files, with small demo interactions persisted to LocalStorage.

## Future Backend Recommendations

- Add secure authentication with role and permission policies.
- Store users, courses, submissions, grades, attendance, files, and audit logs in a real backend.
- Add server-side validation for file uploads, quiz submissions, and grading.
- Add notification delivery through email, push, or school messaging channels.
- Add reporting exports and privacy controls aligned with school policy.
