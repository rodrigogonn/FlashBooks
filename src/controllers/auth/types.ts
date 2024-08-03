import MessageResponse from '../../interfaces/MessageResponse';

export interface LoginWithGoogleRequestBody {
  idToken?: string;
}
export type LoginResponse = { token: string } | MessageResponse;
