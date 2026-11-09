GP Chatbot
A campus-focused AI assistant for Government Polytechnic College, Srinagar Garhwal. The app helps students find information about campus locations, recent announcements, and general college-related queries through a conversational interface.

Live demo: https://gp-chatbot.vercel.app

Overview
GP Chatbot is built with Next.js and Genkit, combining an interactive campus map with an AI-powered chat experience. It can:

answer student questions about campus facilities and directions
summarize latest announcements
answer queries using announcement links as context
support speech-to-text and text-to-speech interactions
provide a simple admin dashboard for managing announcements
Features
Interactive campus map with clickable buildings and locations
AI chat assistant powered by Gemini via Genkit
Announcement summaries and contextual Q&A
Audio transcription and voice responses
Admin login and announcement management interface
Responsive UI built with Next.js and Tailwind CSS
Tech Stack
Next.js 15
React 18
TypeScript
Tailwind CSS
Genkit
Google Gemini / Google AI
Firebase Firestore
Radix UI and Lucide icons
Project Structure
gp-chatbot/
├── src/
│   ├── ai/
│   │   ├── flows/
│   │   │   ├── answer-from-link.ts
│   │   │   ├── answer-student-queries.ts
│   │   │   ├── extract-location-from-query.ts
│   │   │   ├── stt-flow.ts
│   │   │   ├ Summarize-announcements.ts
│   │   │   └── tts-flow.ts
│   │   ├── dev.ts
│   │   └── genkit.ts
│   ├── app/
│   │   ├── admin/
│   │   ├── announcements/
│   │   ├── login/
│   │   ├── actions.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── chatbot/
│   │   ├── ui/
│   │   ├── auth-provider.tsx
│   │   └── interactive-map.tsx
│   ├── hooks/
│   ├── lib/
│   │   ├── data.ts
│   │   ├── firebase.ts
│   │   └── types.ts
│   └── ...
├── .gitignore
├── next.config.js
├── next-env.d.ts
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
Getting Started
Prerequisites
Node.js 18+
npm or yarn
Firebase project credentials
Google AI API key
Install dependencies
npm install
Environment variables
Create a .env.local file in the project root:

GOOGLE_API_KEY=your_google_ai_api_key

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
Run the app
Start the development server:

npm run dev
For Genkit development tools:

npm run genkit:dev
Available Scripts
npm run dev          # Start the Next.js app
npm run build        # Production build
npm run start        # Start the production server
npm run lint         # Run ESLint
npm run typecheck    # TypeScript check
npm run genkit:dev   # Start Genkit dev server
npm run genkit:watch # Watch mode for Genkit
How It Works
The main landing page displays an interactive campus map and the chatbot panel side-by-side.
Student questions are processed through Genkit flows.
Queries involving campus locations are mapped to relevant areas and may include a Google Maps link.
Announcement-related prompts fetch data from Firebase and summarize the latest updates.
Admin users can log in and add new announcements through the admin dashboard.
Admin Dashboard
The admin dashboard is available at:

/admin
It requires authentication and allows staff to add and manage announcement content.

Notes
Firebase configuration is optional at runtime; if not configured, the app falls back to local demo data.
This repository does not currently include a license file.
