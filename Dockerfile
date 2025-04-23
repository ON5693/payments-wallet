# Base image with Node.js
FROM node:20-alpine

# Install dependencies
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only the package manager files to leverage Docker layer caching
COPY pnpm-lock.yaml ./
COPY package.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Build the NestJS app
RUN pnpm build

# Expose the app port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start:prod"]