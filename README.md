# InterviewHub

A mock interview web app I built for my final year BCA project.
You can practice interview questions topic wise, get instant scores
and track your performance over time. Runs completely on your 
local machine, no internet needed after setup.

## Why I made this

I was preparing for placements and couldn't find a free platform
that gives instant feedback and filters questions by experience
level. So I built one myself.

## What it does

- Register and login securely
- Select your experience level
- Select a topic and number of questions
- Answer questions and get instant score out of 100
- See which keywords you missed
- View your interview history
- Track topic wise performance on profile page
- Install as app on your phone (PWA)

## Topics

JavaScript, Python, Java, C++, React, Node.js, TypeScript,
SQL, MongoDB, DSA, System Design, DevOps, Git,
OS and Networking, HR and Behavioral

3000 questions total. 40 per level per topic.

## Experience Levels

- Level 1 — Fresher (0-1 year)
- Level 2 — Junior Developer (1-2 years)
- Level 3 — Mid Level Developer (2-3 years)
- Level 4 — Senior Developer (3-4 years)
- Level 5 — Lead Developer (5+ years)

## Tech used

- Node.js and Express.js — backend server and API
- HTML, CSS, Vanilla JavaScript — frontend
- JWT — for login sessions
- bcrypt — password hashing
- db.json — flat file database
- nodemon — auto restart during development

No framework on frontend. Kept it simple with plain JavaScript
so no build tools needed and setup is very easy.

## How to run

You need Node.js installed on your machine.

Step 1 — Clone or download the project

Step 2 — Open terminal in project folder

Step 3 — Install dependencies
npm install

Step 4 — Start the server
npm run dev

Step 5 — Open browser and go to
http://localhost:5000

## How scoring works

After you submit an answer the app checks three things

1. Keywords — how many important keywords you included (45%)
2. Length — how long your answer is (30%)
3. Structure — how many sentences you wrote (25%)

Score is out of 100 and grade is assigned from A+ to F.

Grade scale
- A+ = 90 to 100 — Outstanding
- A  = 80 to 89  — Excellent
- B+ = 70 to 79  — Good
- B  = 60 to 69  — Average
- C  = 48 to 59  — Needs Work
- D  = 35 to 47  — Poor
- F  = 0 to 34   — Failed

## Project structure

prepai/
├── server.js
├── package.json
├── db.json
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── topics.js
│   │   ├── sessions.js
│   │   └── results.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── db.js
│   └── data/
│       ├── questions.js
│       └── evaluator.js
└── frontend/
    ├── index.html
    ├── css/
    ├── js/
    └── images/

## Features

- 3000 questions across 15 topics
- 5 experience levels
- Instant AI scoring and feedback
- Keyword matching shows what you missed
- Interview history with delete option
- Profile with topic mastery bars
- Edit profile with photo upload
- Dark themed responsive UI
- PWA support — install on phone

## Known issues

- db.json is a flat file so not ideal for many users
  at the same time
- Scoring is keyword based so not 100% accurate
- Requires Node.js server to be running always

## What I plan to add

- Connect GPT or Claude API for smarter evaluation
- Replace db.json with MongoDB
- Add code editor for DSA questions
- Voice input for answers
- Leaderboard to compare with others
- Mobile app using React Native
- PDF report download after interview

## Developer

Vikas Yadav
Nutan College Of Engineering And Research
2025-2026