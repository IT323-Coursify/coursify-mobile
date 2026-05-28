## Coursify Web
## Project Description
Coursify Web is the browser-based frontend of the Coursify platform — a Senior High School course recommendation system. It provides students with a full psychometric assessment experience and personalized ML-powered course recommendations, while also offering dedicated dashboards for admins and superadmins to manage users and monitor platform analytics.
The web version supports all three user roles: student, admin, and superadmin. It communicates with the shared Coursify FastAPI backend via REST API.


## Features
Student
•	User Authentication — Registration with email OTP verification, login, forgot password with reset code flow, and JWT-based session management
•	RIASEC Assessment — Holland Interest Inventory with 36 questions across 6 personality types (Realistic, Investigative, Artistic, Social, Enterprising, Conventional)
•	Big Five Personality Assessment — OCEAN model profiling with 25 questions across 5 traits including reverse-scored items
•	Aptitude Assessment — 12-question subject tests across Math, Science, English, and Abstract Reasoning with easy / medium / hard difficulty tiers
•	ML-Powered Course Recommendations — Top 5 ranked college course suggestions with confidence scores
•	AI Profile Summary — Google Gemini generates a personalized counselor-style summary based on assessment results
•	Dashboard — Full assessment profile with RIASEC bar chart, Big Five trait cards, aptitude scores, top recommended courses, and quick stats panel
•	Assessment History — All past attempts with expandable score breakdowns per attempt (courses, RIASEC, Big Five, aptitude tabs)
•	Course Explorer — Browse and filter college courses by strand and category
•	Profile Management — Edit username, email, grade level, and academic strand
Admin
•	Analytics Dashboard — Platform statistics including total users, new registrations, active/inactive accounts, registration trend chart, strand breakdown, grade level breakdown, and role distribution; filterable by 7-day, 30-day, or all-time range
Superadmin
•	User Management — Paginated, searchable, and filterable user table with role assignment and account activation/deactivation
•	Audit Log — Timestamped record of all admin-initiated role and status changes
•	CSV Export — Download all user data as a CSV file
•	Role-Based Access Control — Three-tier access enforced via protected routes on the frontend


## Technology Stack
Layer	Technology
Framework	React.js (Create React App)
Routing	React Router v6
Charts	Recharts
Icons	React Icons
Local Storage	localStorage
Styling	Plain CSS (Nunito + Sora fonts via Google Fonts)
Environment	.env via REACT_APP_* variables


## System Architecture
Coursify Web (React.js)
        │
        │  localStorage
        │  ┌─────────────────────────────────┐
        │  │  token, coursify_user,           │
        │  │  coursify_role, coursify_        │
        │  │  assessment_progress             │
        │  └─────────────────────────────────┘
        │
        │  Protected Routes
        │  ┌──────────────────────────────────────────┐
        │  │  / (Login)                               │
        │  │  /register                               │
        │  │  /dashboard              → role: user    │
        │  │  /assessment             → role: user    │
        │  │  /courses                → role: user    │
        │  │  /profile                → role: user    │
        │  │  /admin/dashboard        → role: admin+  │
        │  │  /superadmin/dashboard   → role: superadmin│
        │  └──────────────────────────────────────────┘
        │
        │  REST API calls (JWT Bearer token)
        ▼
Coursify FastAPI Backend
All API requests include a Bearer token in the Authorization header. The ProtectedRoute component checks coursify_role from localStorage before rendering any route, redirecting unauthorized users to the appropriate fallback.

## Installation & Setup
Prerequisites
•	Node.js v18 or higher
•	npm or yarn
•	Coursify backend running locally or deployed (see backend README)
1. Clone the repository
git clone https://github.com/yourusername/coursify-web.git
cd coursify-web
2. Install dependencies
npm install
3. Configure the API
Create a .env file in the project root:
REACT_APP_API_URL=http://localhost:8000
Replace the value with your deployed backend URL if not running locally.
4. Start the development server
npm start
The app will be available at http://localhost:3000/coursify-web
5. Build for production
npm run build
The optimized build output will be in the build/ folder, ready for static hosting.
Note: The basename is set to /coursify-web in the router. If you deploy to a different path or domain root, update the basename prop in App.js accordingly.

## Test accounts 
User: 
E: yunasilva01@gmail.com 
P: Genesis1:1

E: anyachan.maki@gmail.com 
P: Genesis1:1

Super admin: 
E: seanfinn830@gmail.com 
P: Genesis1:1

## Known Limitations
•	Admin and superadmin roles are web-only — The mobile version of Coursify only supports the student role. Logging in with admin or superadmin credentials on the mobile app will not grant access to any admin features
•	Email delivery in deployment — OTP verification and password reset emails use Gmail SMTP which requires outbound ports 465 or 587. Most cloud hosting providers block these ports, causing connection timeouts in production. Locally this works fine since the machine can connect directly. The proper solution for production is to replace Gmail SMTP with a dedicated email API service such as SendGrid or Mailgun
•	Assessment results not editable — Once an assessment is submitted it is permanently stored; there is no way to retake or delete a specific attempt from the UI
•	No real-time updates — The analytics dashboard and user management table require a manual page refresh to reflect the latest data


## Coursify Web
## Project Description
Coursify Web is the browser-based frontend of the Coursify platform — a Senior High School course recommendation system. It provides students with a full psychometric assessment experience and personalized ML-powered course recommendations, while also offering dedicated dashboards for admins and superadmins to manage users and monitor platform analytics.
The web version supports all three user roles: student, admin, and superadmin. It communicates with the shared Coursify FastAPI backend via REST API.

## Features
Student
•	User Authentication — Registration with email OTP verification, login, forgot password with reset code flow, and JWT-based session management
•	RIASEC Assessment — Holland Interest Inventory with 36 questions across 6 personality types (Realistic, Investigative, Artistic, Social, Enterprising, Conventional)
•	Big Five Personality Assessment — OCEAN model profiling with 25 questions across 5 traits including reverse-scored items
•	Aptitude Assessment — 12-question subject tests across Math, Science, English, and Abstract Reasoning with easy / medium / hard difficulty tiers
•	ML-Powered Course Recommendations — Top 5 ranked college course suggestions with confidence scores
•	AI Profile Summary — Google Gemini generates a personalized counselor-style summary based on assessment results
•	Dashboard — Full assessment profile with RIASEC bar chart, Big Five trait cards, aptitude scores, top recommended courses, and quick stats panel
•	Assessment History — All past attempts with expandable score breakdowns per attempt (courses, RIASEC, Big Five, aptitude tabs)
•	Course Explorer — Browse and filter college courses by strand and category
•	Profile Management — Edit username, email, grade level, and academic strand
Admin
•	Analytics Dashboard — Platform statistics including total users, new registrations, active/inactive accounts, registration trend chart, strand breakdown, grade level breakdown, and role distribution; filterable by 7-day, 30-day, or all-time range
Superadmin
•	User Management — Paginated, searchable, and filterable user table with role assignment and account activation/deactivation
•	Audit Log — Timestamped record of all admin-initiated role and status changes
•	CSV Export — Download all user data as a CSV file
•	Role-Based Access Control — Three-tier access enforced via protected routes on the frontend

## Technology Stack
Layer	Technology
Framework	React.js (Create React App)
Routing	React Router v6
Charts	Recharts
Icons	React Icons
Local Storage	localStorage
Styling	Plain CSS (Nunito + Sora fonts via Google Fonts)
Environment	.env via REACT_APP_* variables

## System Architecture
Coursify Web (React.js)
        │
        │  localStorage
        │  ┌─────────────────────────────────┐
        │  │  token, coursify_user,           │
        │  │  coursify_role, coursify_        │
        │  │  assessment_progress             │
        │  └─────────────────────────────────┘
        │
        │  Protected Routes
        │  ┌──────────────────────────────────────────┐
        │  │  / (Login)                               │
        │  │  /register                               │
        │  │  /dashboard              → role: user    │
        │  │  /assessment             → role: user    │
        │  │  /courses                → role: user    │
        │  │  /profile                → role: user    │
        │  │  /admin/dashboard        → role: admin+  │
        │  │  /superadmin/dashboard   → role: superadmin│
        │  └──────────────────────────────────────────┘
        │
        │  REST API calls (JWT Bearer token)
        ▼


## Deployment Links
https://drive.google.com/file/d/1KVlR_xhUrL87Eb8BF9vENUXHQWB4bY8B/view

## Screenshots
Mobile
<img width="720" height="1560" alt="c07c86a3-df1d-4146-a726-d1ea4808b13d" src="https://github.com/user-attachments/assets/d3f76639-f0ec-4a65-9172-20548b58c436" />
<img width="720" height="1560" alt="60966dfc-4477-4a2a-9bd3-f6fa6690be81" src="https://github.com/user-attachments/assets/fb4cd478-51e5-4df8-b32d-94106ad4f594" />
<img width="720" height="1560" alt="0a15ad24-a04e-46f0-9ac0-88c82ad158be" src="https://github.com/user-attachments/assets/5915ec9e-e24b-412b-81ae-ad6f06eb9dae" />
<img width="720" height="1560" alt="0aaae7cd-9c5e-4f19-9926-3bbb49e8f61e" src="https://github.com/user-attachments/assets/2ef8dec6-5893-46a4-b01c-946134a0440e" />
<img width="720" height="1560" alt="0a156cee-59da-44fe-bd62-fdbac7262808" src="https://github.com/user-attachments/assets/b04e320e-0dbb-473a-83e3-2da363a6c25c" />
<img width="720" height="1560" alt="a8360659-2049-41e6-bef4-6ae80b8fd124" src="https://github.com/user-attachments/assets/b425e5d1-4360-4412-b3c5-4e39e95eb390" />
<img width="720" height="1560" alt="10bb9424-4dda-4ce4-8d2f-e434967e8010" src="https://github.com/user-attachments/assets/96dbd741-2016-4dce-b340-438c92047609" />




















