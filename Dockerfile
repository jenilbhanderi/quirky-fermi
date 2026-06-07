FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy source code
COPY src/ ./src/
COPY public/ ./public/
COPY .env.example ./.env.example

# Create data directory for SQLite
RUN mkdir -p /data

# Environment
ENV NODE_ENV=production
ENV DB_PATH=/data/hylunian.db
ENV PORT=3001

EXPOSE 3001

CMD ["node", "src/server.js"]
