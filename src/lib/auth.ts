import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from '@prisma/client';

import { nextCookies } from 'better-auth/next-js';

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies()],
});
