# Faith + Life Purpose Community Platform

## Tech Stack
- Frontend: Next.js 14 + TypeScript
- Database: Firebase Firestore
- Auth: Firebase Authentication
- Hosting: Vercel
- Styling: Tailwind CSS

## Quick Start
```bash
npm install
npm run dev
```

## Environment Setup
Copy `.env.example` to `.env.local` and fill in Firebase config.

## Project Structure
```
src/
├── app/                 # Next.js 14 app router
├── components/          # Reusable components
├── lib/                # Firebase config & utilities
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
└── utils/              # Helper functions
```

## Features
- ✅ Email/Password Authentication
- ✅ Role-based Access Control
- ✅ Live Chat & Comments
- ✅ Admin Panel
- ✅ Premium Content
- ✅ Payment Integration Ready

## Deployment

### GitHub Repository
```
https://github.com/noah390/PURPOSE.git
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
3. Deploy automatically on push to main branch

### Local Development
```bash
git clone https://github.com/noah390/PURPOSE.git
cd PURPOSE
npm install
cp .env.example .env.local
# Fill in your Firebase config in .env.local
npm run dev
```