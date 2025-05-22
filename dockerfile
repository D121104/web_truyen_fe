FROM node:20-alpine AS builder

WORKDIR /book-app

COPY package*.json ./

RUN npm install --quiet --no-optional --no-fund --loglevel=error

COPY . .

RUN NEXT_DISABLE_ESLINT_PLUGIN=true npm run build

FROM node:20-alpine

WORKDIR /book-app

COPY --from=builder /book-app/.next ./.next
COPY --from=builder /book-app/package*.json ./
COPY --from=builder /book-app/public ./public

RUN npm install --quiet --only=production --no-optional --no-fund --loglevel=error

EXPOSE 3000

CMD ["npm", "start"]