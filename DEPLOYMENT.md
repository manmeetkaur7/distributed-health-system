# Deployment Guide

This project deploys to Render as five services:

- `distributed-health-frontend`
- `distributed-health-user-service`
- `distributed-health-data-service`
- `distributed-health-notification-service`
- `distributed-health-ai-risk-service`

The Render Blueprint is defined in `render.yaml`.

## 1. Prepare MongoDB Atlas

1. Open MongoDB Atlas and create or select a cluster.
2. Create a database user with a strong password.
3. In Network Access, allow Render to connect.
   - For a quick student/demo deployment, use `0.0.0.0/0`.
   - For production, prefer a tighter allowlist or private networking.
4. Copy the Node.js driver connection string.

Use the same Atlas connection string for all three `MONGO_URI` prompts in Render. Include a database name before the query string:

```txt
mongodb+srv://USERNAME:PASSWORD@CLUSTER_HOST/distributed-health?retryWrites=true&w=majority
```

## 2. Push This Repo To GitHub

Render deploys from a Git provider. Push the current repository, including `render.yaml`, to GitHub or another Render-supported Git provider.

## 3. Create The Render Blueprint

1. Open Render Dashboard.
2. Select **New**.
3. Select **Blueprint**.
4. Connect the repository.
5. Use `render.yaml` as the Blueprint file.
6. When prompted, paste your Atlas connection string into each `MONGO_URI` field.

Render generates `JWT_SECRET` automatically for the user service.

## 4. Verify URLs

After deploy, the frontend should be available at:

```txt
https://distributed-health-frontend.onrender.com
```

The static frontend is built with these API URLs:

```txt
https://distributed-health-user-service.onrender.com/api/auth
https://distributed-health-data-service.onrender.com/api/health
https://distributed-health-notification-service.onrender.com/api/notifications
```

If Render assigns different service URLs, update the frontend service environment variables in Render and redeploy the frontend:

```txt
VITE_AUTH_SERVICE_URL
VITE_HEALTH_SERVICE_URL
VITE_NOTIFICATION_SERVICE_URL
```

## 5. Optional Email Alerts

High-risk notifications are stored in MongoDB even without email settings.

To enable email, add these environment variables to `distributed-health-notification-service` in Render:

```txt
EMAIL_HOST
EMAIL_PORT
EMAIL_SECURE
EMAIL_USER
EMAIL_PASS
EMAIL_FROM
ALERT_EMAIL_TO
```

Redeploy the notification service after adding them.
