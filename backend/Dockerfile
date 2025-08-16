# -------------------------------------
# dependencies layer
# -------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# -------------------------------------
# build layer
# -------------------------------------
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# -------------------------------------
# runtime layer
# -------------------------------------
FROM node:20-alpine
WORKDIR /app

# Copy dist and package.json
COPY --from=build /app/dist ./dist
COPY package*.json ./

# Install **production** dependencies (needed for express, bullmq, etc)
RUN npm ci --omit=dev

EXPOSE 5000
CMD ["node", "dist/index.js"]
