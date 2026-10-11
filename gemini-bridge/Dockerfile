FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --no-audit --no-fund
COPY server.mjs .
COPY src ./src
USER node
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node","server.mjs"]
