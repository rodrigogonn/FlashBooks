export interface LoginWithGoogleRequestBody {
  idToken?: string;
}

export interface LoginWithPasswordRequestBody {
  email?: string;
  password?: string;
}

export interface SetPasswordRequestBody {
  password?: string;
}

export type LoginResponse = { token: string };
