# Kanban Board Backend

NestJS backend scaffold using PostgreSQL, Prisma ORM, and Swagger.

## Setup Instructions

1. Install Node.js 20 or newer and PostgreSQL 14 or newer.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a PostgreSQL database named `kanban_board`.
4. Copy `.env.example` to `.env` and update the connection string if needed.

   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kanban_board?schema=public"
   PORT=8000
   ```

5. Generate the Prisma client:

   ```bash
   npm run prisma:generate
   ```

6. Create and apply the first migration:

   ```bash
   npm run prisma:migrate -- --name init
   ```

7. Start the development server:

   ```bash
   npm run start:dev
   ```

The API runs on `http://localhost:8000`.

Swagger documentation is available at `http://localhost:8000/v1/api/docs`.

## Folder Structure

```text
kanban-board-backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.repository.ts
│   │   └── auth.module.ts
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.repository.ts
│   │   └── users.module.ts
│   ├── boards/
│   ├── board-members/
│   ├── columns/
│   ├── tasks/
│   ├── prisma/
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── common/
│   │   ├── guards/
│   │   ├── decorators/
│   │   └── interceptors/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── .env.example
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

## Useful Commands

- `npm run build` - compile the application
- `npm run start` - start the compiled Nest application
- `npm run prisma:studio` - open Prisma Studio
