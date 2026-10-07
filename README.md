# 💸 Expense Tracker

A clean and responsive **personal expense tracking web app** built with React and Vite. Track spending, organize expenses by category, monitor your budget, and quickly search or sort your transaction history.

> Built as a lightweight, browser-based expense manager with local persistence and a simple Express backend.

## ✨ Features

- **Add expenses** with title, amount, category, and date
- **INR currency formatting** for amounts
- **Budget tracking** with adjustable budget and progress indicator
- **Spending insights** including total spend, current-month spend, and top category
- **Search and filtering** by expense title and category
- **Sorting** by newest, oldest, highest amount, or lowest amount
- **Monthly grouping** for easier expense review
- **Delete individual expenses** or clear the complete expense history
- **Local persistence** using browser `localStorage`
- **Responsive UI** for desktop and smaller screens
- **PWA support** through a web manifest and service worker
- **Express backend** with a welcome route and health-check endpoint

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript (ES Modules)
- CSS
- Browser Local Storage
- Progressive Web App APIs

### Backend
- Node.js
- Express.js

### Deployment
- Vercel-compatible build configuration

## 📁 Project Structure

```text
expense-tracker/
├── backend/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── manifest.json
│   │   └── service-worker.js
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── Home.jsx
│   │   ├── Mainn.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── dist/
├── package.json
├── package-lock.json
├── vercel.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) 18+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/aditya-bhanushali/expense-tracker.git
cd expense-tracker
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Start the frontend

```bash
npm run dev
```

Vite will display the local development URL in your terminal.

### 4. Run the backend

Open a second terminal:

```bash
cd backend
npm install
npm start
```

The Express server runs on port `5000` by default.

Health check:

```text
GET /api/health
```

## 📦 Production Build

From the `frontend` directory:

```bash
npm run build
```

The production build is generated in `frontend/dist`.

The repository also includes a root-level build configuration for Vercel.

## 💾 Data Storage

Expense records are currently stored in the browser using **localStorage**.

This means:

- No database is required to use the core expense-tracking features.
- Expenses remain available in the same browser until the stored data is cleared.
- Data is not automatically synchronized across devices or browsers.

## 🔌 Backend API

The Express backend currently provides:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Returns a welcome message |
| GET | `/api/health` | Returns backend health status |

The backend is structured separately so it can be extended with persistent storage, authentication, and full expense APIs in the future.

## 🎯 Future Improvements

Potential next steps for the project include:

- Persistent database storage
- User authentication
- Cloud synchronization
- Edit existing expenses
- Recurring expenses
- Monthly and category-based charts
- Export to CSV/PDF
- Dark mode
- Better API integration between frontend and backend

## 📄 License

This project currently does not specify a license.

## 👤 Author

**Aditya Bhanushali**

GitHub: [@aditya-bhanushali](https://github.com/aditya-bhanushali)
