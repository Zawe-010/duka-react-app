# Stage 1: Build React app
FROM node:20-alpine AS build

WORKDIR /app

# Allow larger heap for builds
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Install build dependencies for npm packages
RUN apk add --no-cache python3 make g++

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
