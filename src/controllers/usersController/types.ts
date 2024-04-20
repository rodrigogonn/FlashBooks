import MessageResponse from '../../interfaces/MessageResponse';

export interface CreateUserRequestBody {
  username: string;
  email: string;
  password: string;
}

interface SuccessResponse {
  id: string;
  username: string;
  email: string;
}
export type CreateUserResponse = SuccessResponse | MessageResponse;
