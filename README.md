# Distributed Health System

A microservice-based health monitoring application that lets users register, submit health data, receive a rule-based risk level, view their health history, and receive high-risk alerts.

## Project Overview

This system is split into independent services:

- React frontend for authentication, dashboard, health submissions, records, and notifications
- User Service for registration, login, JWT auth, and user profiles
- Health Data Service for storing user health records and coordinating risk checks
- AI Risk Service for rule-based low, medium, and high risk prediction
- Notification Service for storing alerts and optionally sending high-risk email alerts

The local version uses MongoDB databases for the Node services and FastAPI for the AI risk service.

## Architecture Diagram

```txt
React Frontend
   |
   |--> User Service
   |
   |--> Health Data Service --> AI Risk Service
                              |
                              --> Notification Service
```

## Tech Stack

Frontend:

- React
- Vite
- React Router
- Axios
- Recharts
- CSS

Backend:

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Nodemailer

AI Service:

- Python
- FastAPI
- Uvicorn
- Pydantic

Development:

- Nodemon
- Concurrently
- Git

## Services And Ports

| Service | Port | Description |
| --- | ---: | --- |
| Frontend | 5173 | React app |
| User Service | 5001 | Auth and user profiles |
| Health Data Service | 5002 | Health records and risk coordination |
| Notification Service | 5003 | Alert storage and optional email alerts |
| AI Risk Service | 8000 | Risk prediction API |
| MongoDB | 27017 | Local database |

## Setup Steps

### 1. Clone The Repository

```bash
git clone https://github.com/manmeetkaur7/distributed-health-system.git
cd distributed-health-system
```

### 2. Install Root Dependency

```bash
npm install
```

The root package uses `concurrently` to run all services together.

### 3. Install Node Service Dependencies

```bash
cd user-service
npm install

cd ../health-data-service
npm install

cd ../notification-service
npm install

cd ../frontend
npm install
```

### 4. Set Up AI Risk Service

From the project root:

```bash
cd ai-risk-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

For macOS or Linux:

```bash
cd ai-risk-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 5. Create Environment Files

Copy each `.env.example` into `.env` and update values as needed.

User Service:

```bash
copy user-service\.env.example user-service\.env
```

Health Data Service:

```bash
copy health-data-service\.env.example health-data-service\.env
```

Notification Service:

```bash
copy notification-service\.env.example notification-service\.env
```

Frontend:

```bash
copy frontend\.env.example frontend\.env
```

For local development, the example localhost URLs are enough. For deployment, replace them with deployed service URLs.

### 6. Start MongoDB

Make sure MongoDB is running locally on:

```txt
mongodb://localhost:27017
```

### 7. Run The Full App

From the project root:

```bash
npm run dev
```

Open the frontend:

```txt
http://127.0.0.1:5173
```

FastAPI docs:

```txt
http://localhost:8000/docs
```

## API Flow

1. Register or log in through the frontend.
2. The User Service returns a JWT and user id.
3. Submit health data from the frontend.
4. Health Data Service sends the data to AI Risk Service.
5. AI Risk Service returns `low`, `medium`, or `high`.
6. Health Data Service saves the record.
7. If risk is `high`, Health Data Service calls Notification Service.
8. Notification Service saves the alert and can optionally send an email.

## Main API Endpoints

User Service:

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

Health Data Service:

```txt
POST /api/health
GET  /api/health/:userId
```

AI Risk Service:

```txt
POST /predict-risk
GET  /docs
```

Notification Service:

```txt
POST /api/notifications
GET  /api/notifications/:userId
```

## Deployment Notes

For deployment, replace localhost values in environment variables.

Frontend:

```env
VITE_AUTH_SERVICE_URL=https://your-user-service.com/api/auth
VITE_HEALTH_SERVICE_URL=https://your-health-service.com/api/health
VITE_NOTIFICATION_SERVICE_URL=https://your-notification-service.com/api/notifications
```

Health Data Service:

```env
AI_SERVICE_URL=https://your-ai-risk-service.com
NOTIFICATION_SERVICE_URL=https://your-notification-service.com
```

Never commit real `.env` files or secrets.

## Future Improvements

- Add admin, doctor, and patient roles
- Add role-based route protection
- Replace rule-based risk prediction with a trained ML model
- Add email or SMS provider configuration for production alerts
- Add Dockerfiles for each service
- Add Docker Compose for local multi-service startup
- Add automated tests for backend services
- Add CI/CD deployment pipeline
- Add refresh tokens and stronger auth hardening
- Add pagination and filtering for records and notifications
