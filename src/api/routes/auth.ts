import { FastifyInstance } from 'fastify';
import { verifyToken, requireAuth } from '../handlers/authHandlers';

export async function authRoutes(fastify: FastifyInstance) {
  // Verify token endpoint
  fastify.get('/auth/verify', verifyToken);
}
