# Student Management System

A full-stack web application for managing student records built with React, Node.js, Express, and MongoDB.

## Features

- Complete CRUD operations for student records
- Modern UI with Tailwind CSS and dark mode support
- Search and filter capabilities
- Responsive design for all devices
- RESTful API with proper validation
- Error handling and notifications

## Production Deployment

### Prerequisites

- Docker and Docker Compose installed
- Git

### Deployment Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sms.git
   cd sms
   ```

2. Deploy with Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api
   - API Documentation: http://localhost:5000/api/docs

### Environment Variables

#### Frontend Environment Variables

Create a `.env` file in the Frontend directory:

```
VITE_API_URL=http://localhost:5000/api
VITE_APP_TITLE=Student Management System
```

#### Backend Environment Variables

Create a `.env` file in the Backend directory:

```
PORT=5000
MONGODB_URI=mongodb://mongodb:27017
MONGODB_DBNAME=student_management
NODE_ENV=production
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

## Development Setup

### Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Architecture

- **Frontend**: React.js with Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **API Documentation**: Swagger
- **Containerization**: Docker

## Production Optimizations

- Multi-stage Docker builds for smaller images
- Nginx for serving static files and API proxying
- Compression for faster load times
- Security headers with Helmet.js
- Error boundaries for graceful error handling
- Lazy loading for improved performance
- Connection pooling for database reliability
- Health checks for all services
