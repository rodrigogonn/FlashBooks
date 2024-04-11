import MessageResponse from '../../interfaces/MessageResponse';

export interface LoginRequestBody {
  username: string;
  password: string;
}
export type LoginResponse = { token: string } | MessageResponse;
