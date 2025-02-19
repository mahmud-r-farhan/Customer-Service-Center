
# Customer Service Center

## Overview

The Customer Service Center Application is a web-based system designed to manage customer registration, token generation, serial number tracking, and agent-assisted consultation. Customers register with their name and phone number, receive a token, and wait for their turn. Agents call customers for consultation, and after completion, the records are updated as recently completed cases.

## Features

-   Customer Registration
-   Token Generation
-   Serial Token Display
-   Agent Call System
-   Consultation Management
-   Recently Completed Cases

## Technology Stack

### Backend (cs-center)

-   Node.js (CommonJS)
-   Express.js
-   MongoDB (Mongoose ORM)
-   WebSockets (ws)
-   Authentication (JWT, bcrypt)
-   Environment Configuration (dotenv)
-   CORS Handling

### Frontend (frontend)

-   React.js (Vite)
-   React Router DOM
-   Redux Toolkit
-   Tailwind CSS
-   Framer Motion (Animations)
-   Sonner (Notifications)
-   Axios (API Communication)
-   WebSockets (ws)

## Installation

### Backend Setup

1.  Clone the repository:
    
    ```sh
    git clone https://github.com/mahmud-r-farhan/Customer-Service-Center
    cd Customer-Service-Center
    
    ```
    
2.  Install dependencies:
    
    ```sh
    npm install
    
    ```
    
3.  Set up environment variables in a `.env` file:
    
    ```env
    PORT=5000
    MONGODB_URI=<your_mongodb_uri>
    JWT_SECRET=<your_jwt_secret>
    frontendURL=http://localhost:5173
    
    ```
    
4.  Start the backend server:
    
    ```sh
    node index.js
    
    ```
    

### Frontend Setup

1.  Navigate to the frontend directory:
    
    ```sh
    cd frontend
    
    ```
    
2.  Install dependencies:
    
    ```sh
    npm install
    
    ```
    
3.  Run the development server:
    
    ```sh
    npm run dev
    
    ```
    

## API Endpoints

### Authentication

-   **POST /register** - Register a new customer with name and phone number.
-   **POST /login** - Authenticate users and generate a JWT token.

### Token System

-   **POST /generate-token** - Generate a token for a customer.
-   **GET /tokens** - Fetch the list of waiting tokens.

### Agent Operations

-   **POST /call-customer** - Call the next customer for consultation.
-   **POST /complete-consultation** - Mark consultation as completed.
-   **GET /recently-completed** - Retrieve a list of recently completed cases.

### WebSocket Events

-   `new-token` - Broadcasts a new token to all connected clients.
-   `customer-called` - Notifies when a customer is called.
-   `consultation-completed` - Updates the UI when a consultation is completed.

## Workflow

1.  **Customer Registration:** Customers enter their name and phone number.
2.  **Token Generation:** Upon registration, a token is issued.
3.  **Waiting in Queue:** Tokens are displayed in the serial board.
4.  **Agent Call:** Agents call customers based on token priority.
5.  **Consultation:** Customers receive service from agents.
6.  **Completion:** Consultation is marked as completed and moved to history.

## Future Enhancements

-   SMS Notifications for token updates
-   Role-based access control for admins and agents
-   AI-based customer queue optimization