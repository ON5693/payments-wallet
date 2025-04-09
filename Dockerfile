FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json          .
COPY package-lock.json     .

RUN npm install --frozen-lockfile

COPY src                  ./src
COPY prisma               ./prisma
COPY tsconfig.json        .
COPY .env                 .

RUN npx prisma generate

RUN pnpm build

EXPOSE ${PORT}

CMD ["pnpm", "start:prod"]