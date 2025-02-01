import { ErrorResponse } from './ErrorResponse';
import { SuccessResponse } from './SuccessResponse';
import { Response, Request } from 'express';

export type ApiResponse<T = {}> = Response<
  (T & SuccessResponse) | ErrorResponse
>;

export type ApiRequestWithBody<T> = Request<{}, {}, T>;

export type ApiRequestWithParamsAndBody<P, B> = Request<P, {}, B>;

export type ApiRequestWithParams<P> = Request<P>;

export type ApiRequestWithQuery<T> = Request<{}, {}, {}, T>;
