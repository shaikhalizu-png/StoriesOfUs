# Stage 1: Build frontend
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup backend and serve
FROM node:20-alpine

WORKDIR /app/backend

# Copy backend files and install dependencies
COPY backend/package*.json ./
RUN npm install --production

COPY backend/ ./

# Copy built frontend to backend's public folder
COPY --from=frontend-build /app/frontend/build ./public

# Expose backend port
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]