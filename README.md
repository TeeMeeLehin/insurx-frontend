# INSURX

SaaS web application for insurance underwriters to assess climate-driven health and financial risks.

## Deliverables

- **Signup** – Create account (name, email, subscription plan) and continue to payment
- **Login** – Email and password; only users with active subscription can log in
- **Stripe** – Payment flow (Monthly $500 / Annual $5,000); redirect to Stripe Checkout, then success or cancel
- **Dashboard** – ChatGPT-like UI: sidebar (conversations), chat area, user dropdown, logout
- **Logout** – Clear session and redirect to home; user can log in again with the same account

Auth and conversations are simulated with localStorage (no database required for the demo).

## Getting Started

### Install

```bash
npm install
```

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values. Required variables:

| Variable                             | Description                                           |
| ------------------------------------ | ----------------------------------------------------- |
| `DATABASE_URL`                       | Prisma database URL (e.g. `file:./dev.db` for SQLite) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (client)                       |
| `STRIPE_SECRET_KEY`                  | Stripe secret key (server)                            |
| `STRIPE_WEBHOOK_SECRET`              | Stripe webhook signing secret                         |
| `AUTH_SECRET`                        | Secret for session/auth (min 32 chars)                |
| `GEMINI_API_KEY`                     | Gemini API key for risk analysis (optional at first)  |

Never commit `.env.local` or any file containing real secrets.

### Database (Prisma)

Generate the Prisma client and create the database schema:

```bash
npx prisma generate
npm run db:push
```

This generates the client and applies the schema to your database (SQLite by default). Run `npm run db:studio` to open Prisma Studio. If `npm run build` fails with a Prisma error, run these commands first.

### Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm run start
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
