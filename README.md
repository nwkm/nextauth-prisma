This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This is a mini test about user account connection.

## Getting Started

First create .env for docker-compose in docker folder:

```bash
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_ROOT_PASSWORD=root
POSTGRES_PORT=5432
```

Start the local postgresql database with docker:

```bash
cd docker
docker-compose up -d
```

Copy .env.example for .env file then make sure all variables are not empty.

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Stacks

-   [x] Next v14
-   [x] NextAuth v.5
-   [x] Prisma v5
-   [x] Tailwind and Shadcn-ui
-   [x] Postgresql
