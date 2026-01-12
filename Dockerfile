# Stage 1: Build React app
FROM node:20-alpine AS build

WORKDIR /app

# Allow larger heap for builds
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Install build dependencies for npm packages
RUN apk add --no-cache python3 make g++

# Copy package files first
COPY package*.json ./

# Upgrade npm to latest version
RUN npm install -g npm@11.7.0

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy built app from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy your custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
