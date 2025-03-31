# Docker Setup for Subscription Tracker

This document explains how to run the Subscription Tracker application using Docker.

## Prerequisites

- Docker and Docker Compose installed on your system
- Git repository cloned to your local machine

## Environment Variables

Before running the application, you need to set up your environment variables. Create a `.env.local` file in the root directory with the following variables:

```
MONGODB_URI=mongodb://mongodb:27017/subscription-tracker
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here
```

Replace `your_nextauth_secret_key_here` with a secure random string for NextAuth.js.

## Running the Application

1. Build and start the containers:

```bash
docker-compose up -d
```

2. Access the application at http://localhost:3000

3. To stop the containers:

```bash
docker-compose down
```

## Data Persistence

MongoDB data is persisted in a Docker volume named `mongodb_data`. This ensures your data remains intact between container restarts.

## Development Mode

For development with hot reloading, modify the docker-compose.yml file to use the dev command:

```yaml
# In the frontend service
command: npm run dev
```

## Troubleshooting

- If you encounter connection issues to MongoDB, ensure the MONGODB_URI environment variable is correctly set.
- For NextAuth issues, verify that NEXTAUTH_URL and NEXTAUTH_SECRET are properly configured.
