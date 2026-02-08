# Chat App Frontend

This is the frontend for the Chat Application, built with **Vite** and **Vanilla JavaScript**. It uses WebSockets (StompJS & SockJS) for real-time communication and FontAwesome for icons.

## Tech Stack

*   **Vite**: Fast build tool and development server.
*   **Vanilla JavaScript**: Core logic without heavy framework overhead.
*   **StompJS & SockJS**: Real-time messaging with the backend.
*   **FontAwesome**: UI icons.

## Prerequisites

*   **Node.js** (v18+ recommended)
*   **npm**

## Getting Started

### 1. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 2. Configuration

The application uses environment variables for configuration. The defaults are set in `vite.config.js` and `.env` files.

Key environment variables:
*   `VITE_BASE_URL`: API base URL (default: `https://vkychatapp.com/api/v1`)
*   `VITE_BASE_URL_WEBSOCKET`: WebSocket URL (default: `https://vkychatapp.com/ws`)

### 3. Running Locally

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or the port specified in your console).

### 4. Building for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist` directory.

### 5. Docker

You can run the frontend using Docker.

```bash
docker-compose -f docker-compose.frontend.yml up --build -d
```

This will build the image and start the container on ports `80` and `443` (configured for SSL/Proxy in the compose file).

## Project Structure

*   `frontend/src/js`: Application logic (WebSocket handling, UI updates).
*   `frontend/src/css`: Stylesheets.
*   `vite.config.js`: Vite configuration, including proxy and build settings.
