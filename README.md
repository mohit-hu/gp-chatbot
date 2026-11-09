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

<img width="247" height="520" alt="image" src="https://github.com/user-attachments/assets/b9c6a4c9-f40f-4949-93c6-aa0a640cfa1f" />

Getting Started
Prerequisites
Node.js 18+
npm or yarn
Firebase project credentials
Google AI API key
Install dependencies
npm install
Environment variablesCreate a .env.local file in the project root:

<img width="612" height="187" alt="image" src="https://github.com/user-attachments/assets/c5d53735-4922-4712-b4df-3dd7e7a2e144" />


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
