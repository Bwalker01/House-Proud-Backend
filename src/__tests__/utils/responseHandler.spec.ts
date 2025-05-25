import { ResponseHandler } from '../../api/utils/responseHandler';
import { FastifyReply } from 'fastify';
import { ApiError } from '../../api/apiError';
import { ResponseData } from '../../api/types/response';

describe('Response Handler', () => {
  let mockReply: jest.Mocked<FastifyReply>;

  beforeEach(() => {
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as any;
  });

  it('should create success response with data', () => {
    const data: ResponseData = { status: 200, data: { id: 1, name: 'Test' } };
    ResponseHandler.success(mockReply, data);

    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith({
      success: true,
      data: { id: 1, name: 'Test' },
      error: null,
      message: null,
    });
  });

  it('should create internal error response', () => {
    const error = ApiError.internal('Test error');
    ResponseHandler.error(mockReply, error);

    expect(mockReply.status).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalledWith({
      success: false,
      data: null,
      error: error.toJSON(),
      message: 'Test error',
    });
  });

  it('should create not found error response', () => {
    const error = ApiError.notFound('Test error');
    ResponseHandler.error(mockReply, error);

    expect(mockReply.status).toHaveBeenCalledWith(404);
    expect(mockReply.send).toHaveBeenCalledWith({
      success: false,
      data: null,
      error: error.toJSON(),
      message: 'Test error',
    });
  });
});
