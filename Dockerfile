# Stage 1: Build TypeScript code
FROM node:18.19-alpine as builder

WORKDIR /app

COPY package*.json .
COPY tsconfig.json .

# Install dependencies for building
RUN npm ci

COPY src/ src/

# Build TypeScript to JavaScript
RUN npm run build

# Stage 2: Create a smaller production image
FROM node:18.19-alpine

WORKDIR /app

COPY package*.json ./
COPY migrations/ migrations/

RUN npm install pm2 -g

COPY --from=builder /app/dist/ ./dist/
COPY --from=builder /app/node_modules/ ./node_modules/

# Set environment to production
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=5000

USER node

EXPOSE 5000

CMD sh -c "npm run migrate up && pm2-runtime dist/app.js"