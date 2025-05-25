import { ApiError } from '../apiError';

export type ResponseData = {
  status: number;
  data?: any;
  error?: ApiError;
  message?: string;
};
