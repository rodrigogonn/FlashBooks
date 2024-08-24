import { ErrorResponse } from './ErrorResponse';
import { SuccessResponse } from './SuccessResponse';
import { Response } from 'express';

export type ApiResponse<T> = Response<(T & SuccessResponse) | ErrorResponse>;
