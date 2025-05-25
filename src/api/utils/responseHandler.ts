import { FastifyReply } from 'fastify';
import { ResponseData } from '../types/response';
import { ApiError } from '../apiError';

export class ResponseHandler {
  static success(res: FastifyReply, data: ResponseData): FastifyReply {
    return res.status(data.status).send({
      success: true,
      data: data.data ?? null,
      error: data.error ?? null,
      message: data.message ?? null,
    });
  }

  static error(res: FastifyReply, error: ApiError): FastifyReply {
    return res.status(error.statusCode).send({
      success: false,
      data: null,
      error: error.toJSON(),
      message: error.message,
    });
  }
}
