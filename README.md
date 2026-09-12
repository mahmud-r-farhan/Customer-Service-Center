# Customer Service Center

[![CI Test Suite](https://github.com/mahmud-r-farhan/Customer-Service-Center/actions/workflows/test.yml/badge.svg)](https://github.com/mahmud-r-farhan/Customer-Service-Center/actions/workflows/test.yml)

The **Customer Service Center** is a full-stack, enterprise-ready web application designed to streamline customer queue management, token generation, real-time ticket tracking, and agent-assisted consultations.

It provides an efficient workflow where customers register to receive a unique queue token, while agents call customers, manage consultations, track duration, export reports, and communicate in real-time across connected displays using WebSockets.

![CS Center Banner](https://i.postimg.cc/CxqtD63L/unnamed-(3)-(1).jpg)

---

## 🌟 Key Features

- **Guest Registration & Unique Token Generation**: Customers join the queue by providing their name and phone number to receive an auto-generated token (e.g. `A01`, `B05`).
- **Real-Time Queue Dashboard**: Live serial queue display showcasing "Now Serving", "Next in Line", and "Recently Completed" sessions with WebSocket instant sync.
- **Agent Call System & Session Management**: Agents start sessions, assign themselves to clients, track active durations, and mark consultations as completed.
- **Data Export**: Export customer consultation history from the last 24 hours to `.xlsx` Excel spreadsheets for reporting and analytics.
- **Secure Authentication**: JWT-based authentication stored in HttpOnly cookies with password hashing using `bcrypt`.
- **Responsive UI/UX**: Built with modern React, Tailwind CSS, Framer Motion animations, dark mode support, and full-screen display mode for waiting room TVs.
- **Docker Ready**: Pre-configured Docker Compose setup for backend, frontend, and MongoDB services.

---

## 🛠️ Technology Stack

### Backend
- **Node.js**: CommonJS runtime environment.
- **Express.js**: REST API framework with rate limiting and input validation.
- **MongoDB & Mongoose**: Database and ORM with compound indexing for efficient token lookups.
- **WebSockets (`ws`)**: Real-time bidirectional communication server.
- **JWT & bcryptjs**: Authentication and secure password hashing.

### Frontend
- **React.js (Vite)**: Modern component-based UI library.
- **Redux Toolkit**: Centralized state management with custom WebSocket middleware.
- **Tailwind CSS & Framer Motion**: Responsive utility-first styling and smooth UI transitions.
- **Sonner**: Toast feedback notifications.
- **Axios & SheetJS (xlsx)**: HTTP client and Excel data export integration.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas cloud URI
- **Docker & Docker Compose** *(Optional for containerized setup)*

---

### 💻 Local Environment Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/mahmud-r-farhan/Customer-Service-Center.git
cd Customer-Service-Center
```

#### 2. Backend Setup
1. Install backend dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/customer_service
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=1h
   FRONTEND_URL=http://localhost:5173
   ```
3. Start the backend server:
   ```bash
   node server.js
   ```

#### 3. Frontend Setup
1. Navigate to the frontend folder and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_SERVER_URL=http://localhost:5000
   VITE_WS_URL=ws://localhost:5000/ws
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the web app in your browser at `http://localhost:5173`.

---

### 🐳 Docker Setup

Run the full application stack (MongoDB, Backend, and Frontend) using Docker Compose:

```bash
docker-compose up --build
```

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **MongoDB**: `mongodb://localhost:27017`

---

## 📖 How to Use

1. **Agent Registration / Login**:
   - Navigate to `/register` or `/login` to create an agent account.
   - Sessions are authenticated securely using HttpOnly cookies.

2. **Customer Registration & Token Printing**:
   - Go to **Add Guest** (`/add-guest`).
   - Enter the guest's name and phone number.
   - Click **Add Guest** to generate a token (e.g., `A01`) and print a token card.

3. **Waiting Room Display**:
   - Open **Serial Queue** (`/serial`) on a waiting room monitor or screen.
   - Click **Full Screen** mode for TV displays.
   - Live updates notify waiting customers when their token is called.

4. **Agent Dashboard & Session Handling**:
   - Access **Dashboard** (`/dashboard`).
   - View active queue statistics and click **Start Consult** to begin a session with the next client.
   - Complete the session when finished; the system records total consultation time and agent details.

5. **Report Export**:
   - Click **Export Data** on the Dashboard to download an Excel sheet (`.xlsx`) containing customer records, consultation start times, durations, and assigned agents from the last 24 hours.

---

## 📡 REST API Documentation

### Health Check
- `GET /api/health` - Check backend server and API operational status.

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new service agent.
- `POST /api/auth/login` - Login agent and set HttpOnly session cookie.
- `POST /api/auth/logout` - Clear session cookie and log out agent.
- `GET /api/auth/me` - Fetch currently authenticated user profile.
- `PUT /api/auth/settings` - Update agent profile details (name/email).

### Client & Queue Management (`/api/clients`)
- `GET /api/clients` - Retrieve all client records.
- `POST /api/clients` - Add a new guest to the active queue and issue a unique token.
- `PUT /api/clients/:id/status` - Update client status (`queued`, `consulting`, `done`) and assigned agent.
- `GET /api/clients/next-available-token` - Find the next unassigned active token in queue.
- `GET /api/clients/check-token/:token` - Check whether a given token is currently active.
- `DELETE /api/clients/recycle-tokens` - Clear completed customer tokens older than 24 hours.

---

## 🔄 Real-Time WebSockets

The application uses WebSockets (`ws`) to sync queue states across all connected clients instantly.

### WS Events Broadcasted:
- `CLIENTS_UPDATE`: Full list update sent when clients are added, updated, or removed.
- `CLIENT_STATUS_UPDATED`: Single client status change event (e.g. from `queued` to `consulting` or `done`).
- `CLIENT_ASSIGNED`: Event emitted when an agent assigns themselves to a client.

---

## 🧪 Testing & CI/CD

Backend integration tests are written using Node.js native test runner (`node:test`) and `supertest`.

### Run Automated Tests Locally
```bash
npm test
```

### GitHub Actions CI
Automated testing and build verification run on every push and pull request via `.github/workflows/test.yml`.

---

## 📄 License

This project is open-source and released under the [ISC License](LICENSE).
