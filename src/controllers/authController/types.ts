import MessageResponse from '../../interfaces/MessageResponse';

export interface LoginRequestBody {
  email: string;
  password: string;
}
export type LoginResponse = { token: string } | MessageResponse;
