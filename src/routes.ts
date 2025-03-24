import { AppError } from './types/error';
import { StandardResponse } from './types/response';
import { FastifyInstance } from "fastify";

export async function routes(fastify: FastifyInstance) {
    fastify.get('/ping', async (req, res) => {
        const response: StandardResponse = {
            success: true,
            message: `Pong!`,
            data: {},
            errors: []
        }
        return res.status(200).send(response);
    });
}