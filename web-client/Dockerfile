FROM node:20-alpine 

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY . .

RUN pnpm install

EXPOSE 5173
CMD ["pnpm", "run", "dev", "--", "--host"]