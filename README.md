# Customer Service Center

The Customer Service Center is a web-based application designed to streamline customer queue management, token generation, and agent-assisted consultations. It enables customers to register with their name and phone number, receive a unique token, and wait for their turn. Agents can call customers for consultation, track ongoing services, and mark consultations as completed, with real-time updates across the system.

## Features

-   **Customer Registration**: Customers provide their name and phone number to join the queue.
-   **Token Generation**: Automatically generates unique tokens for each registered customer.
-   **Serial Token Display**: Displays the current serving token and queue status on a dedicated dashboard.
-   **Agent Call System**: Allows agents to call the next customer in the queue for consultation.
-   **Consultation Management**: Tracks ongoing consultations and updates their status upon completion.
-   **Recently Completed Cases**: Displays a list of recently completed consultations, filtered to the last 24 hours.
-   **Excel Export**: Enables exporting customer data from the last 24 hours to an Excel file for reporting.
-   **Real-time Updates**: Uses WebSockets to provide live updates to all connected clients.
-   **User Authentication**: Secure login and registration for agents with JWT-based authentication.

![CS Center banner](https://customer-service-center.vercel.app/Gemini_Generated_Image_fxeinjfxeinjfxei.png)

![CS Center banner](https://customer-service-center.vercel.app/banner.png)

## Technology Stack

### Backend (cs-center)

-   **Node.js**: Runtime environment (CommonJS modules).
-   **Express.js**: Web framework for API development.
-   **MongoDB**: Database for storing customer and user data (via Mongoose ORM).
-   **WebSockets**: Real-time communication using the `ws` library.
-   **JWT & bcrypt**: Authentication and password hashing for secure user management.
-   **dotenv**: Environment variable management.
-   **CORS**: Cross-origin resource sharing for secure frontend-backend communication.

### Frontend (frontend)

-   **React.js**: UI library (built with Vite for fast development).
-   **React Router DOM**: Client-side routing for navigation.
-   **Redux Toolkit**: State management for predictable state updates.
-   **Tailwind CSS**: Utility-first CSS framework for styling.
-   **Framer Motion**: Smooth animations for enhanced user experience.
-   **Sonner**: Toast notifications for user feedback.
-   **Axios**: HTTP client for API communication.
-   **xlsx**: Library for exporting data to Excel format.
-   **WebSockets**: Client-side WebSocket integration for real-time updates.

## Installation

### Prerequisites

-   Node.js (v16 or higher)
-   MongoDB (local or cloud instance, e.g., MongoDB Atlas)
-   Git

### Backend Setup

1.  Clone the repository:
    
    ```bash
    git clone https://github.com/mahmud-r-farhan/Customer-Service-Center
    cd Customer-Service-Center
    
    ```
    
2.  Install backend dependencies:
    
    ```bash
    npm install
    
    ```
    
3.  Create a `.env` file in the root directory with the following variables:
    
    ```env
    PORT=5000
    MONGODB_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_secure_jwt_secret>
    frontendURL=http://localhost:5173
    
    ```
    
4.  Start the backend server:
    
    ```bash
    node server.js
    
    ```
    

### Frontend Setup

1.  Navigate to the frontend directory:
    
    ```bash
    cd frontend
    
    ```
    
2.  Install frontend dependencies:
    
    ```bash
    npm install
    
    ```
    
3.  Create a `.env` file in the `frontend` directory with the following variables:
    
    ```env
    VITE_SERVER_URL=http://localhost:3000
    VITE_WS_URL=ws://localhost:3000
    
    ```
    
4.  Run the development server:
    
    ```bash
    npm run dev
    
    ```
    
5.  Open your browser and navigate to `http://localhost:5173`.
    

## API Endpoints

### Authentication

-   **POST /api/auth/register**: Register a new agent.
    -   Body: `{ name: string, email: string, password: string }`
    -   Response: `{ user: { id, name, email, role }, token: string }`
-   **POST /api/auth/login**: Authenticate an agent and return a JWT token.
    -   Body: `{ email: string, password: string }`
    -   Response: `{ user: { id, name, email, role }, token: string }`
-   **PUT /api/auth/settings**: Update agent profile settings.
    -   Body: `{ name: string, email: string }`
    -   Headers: `Authorization: Bearer <token>`
    -   Response: `{ id, name, email, role }`

### Client Management

-   **GET /api/clients**: Retrieve all clients.
    -   Headers: `Authorization: Bearer <token>`
    -   Response: `[{ _id, name, number, token, status, createdAt, updatedAt }, ...]`
-   **POST /api/clients**: Add a new client to the queue.
    -   Body: `{ name: string, number: string, token: string }`
    -   Headers: `Authorization: Bearer <token>`
    -   Response: `{ _id, name, number, token, status, createdAt, updatedAt }`
-   **PUT /api/clients/:id/status**: Update client status (upcoming/done).
    -   Body: `{ status: "upcoming" | "done" }`
    -   Headers: `Authorization: Bearer <token>`
    -   Response: `{ _id, name, number, token, status, createdAt, updatedAt }`

### WebSocket Events

-   **CLIENTS_UPDATE**: Broadcasts the updated client list to all connected clients.
    -   Payload: `[{ _id, name, number, token, status, createdAt, updatedAt }, ...]`
-   **CLIENT_STATUS_UPDATED**: Notifies when a client's status is updated.
    -   Payload: `{ _id, name, number, token, status, createdAt, updatedAt }`
-   **CLIENT_ASSIGNED**: Notifies when a client is assigned to an agent.
    -   Payload: `{ _id, name, number, token, status, createdAt, updatedAt }`

## Workflow

1.  **Customer Registration**: Customers provide their name and phone number via the "Add Guest" page.
2.  **Token Generation**: A unique token is generated and assigned to the customer.
3.  **Queue Display**: The "Serial" page displays the current serving token and upcoming queue.
4.  **Agent Interaction**: Agents use the "Dashboard" to call customers and manage consultations.
5.  **Consultation Completion**: Agents mark consultations as done, updating the client's status.
6.  **Real-time Updates**: WebSockets ensure all clients see queue changes instantly.
7.  **Data Export**: Agents can export client data from the last 24 hours to Excel from the Dashboard.

## UI/UX Improvements

-   **Settings Page Fix**: Added `useEffect` to sync form inputs with user data, preventing empty fields.
-   **Serial Page**: Limited "Recently Completed" section to show only clients completed in the last 24 hours.
-   **Dashboard**: Added an "Export Last 24h" button to download client data as an Excel file.
-   **Visual Enhancements**:
    -   Improved color contrast for better readability.
    -   Added subtle animations with Framer Motion for smoother transitions.
    -   Enhanced card designs with glassmorphism effects (backdrop-blur).
    -   Consistent typography and spacing for a polished look.
-   **Responsive Design**: Optimized layouts for mobile, tablet, and desktop screens.
-   **Accessibility**: Added proper ARIA labels and keyboard navigation support.

---

## Installation and Local Setup

**Please refer to the setup guideline.mmd for more details.**

or,
#### *Visit*: https://www.mermaidchart.com/app/projects/908082d1-8773-440e-b4e4-c78245f0677d/diagrams/f324a2d5-0458-438a-a8ff-2aaa1eea41f8/version/v0.1/edit