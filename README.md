# Tour Booking Project

Functional demo project: React + TypeScript frontend, Node + Express backend with Supabase database.

---

## Prerequisites

- Node.js & npm installed  
- Supabase project (get URL & anon key)  
- Git (optional)  

---

## Setup Instructions

## 1. Clone the repo

```
git clone https://github.com/YourUsername/Final-Project-BSSE-2.git
cd tour-booking-project
```

## 2. Backend Setup
```
cd backend
npm install
```

## Add .env file
```
Add .env file
```
## Run backend
```
npm run dev   # development mode
npm start     # normal mode
```
## 3. Frontend Setup
```
cd ../frontend
npm install
npm start
```
Frontend runs at http://localhost:3000/

## 4. Optional Tools
Storybook (UI components):
```
npx sb init
npm run storybook
```
## Cypress (E2E testing):
```
npm install --save-dev cypress
npx cypress open
```
## Jest (backend testing):
```
cd backend
npm test
```

## Run Storybook testing:
```
cd frontend
npm run storybook
```