import { FastifyRequest } from 'fastify';

export interface User {
  uid: string;
  email?: string;
  name?: string;
}

export interface AuthenticatedRequest extends FastifyRequest {
  user?: User;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
  }
}
