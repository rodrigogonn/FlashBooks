import { MessageResponse } from './MessageResponse';

export interface ErrorResponse extends MessageResponse {
  success: false;
  error?: any;
  stack?: string;
}
