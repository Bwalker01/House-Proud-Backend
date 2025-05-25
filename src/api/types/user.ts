import { FastifyRequest } from 'fastify';

export interface User {
  uid: string;
  email?: string;
  name?: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
  }
}

export type user = {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  householdId: string;
  created: Date;
};
