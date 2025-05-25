import { FastifyInstance } from 'fastify';
import { createHousehold, getHousehold } from '../handlers/householdHandlers';
import { requireAuth } from '../handlers/authHandlers';

export async function householdRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', requireAuth);

  fastify.get('/households', getHousehold);
  fastify.post('/households', createHousehold);
}
