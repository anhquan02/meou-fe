export interface RawCurrentUser {
  user_id?: number;
  username: string;
  fullname?: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  fullName?: string;
  nameRole?: string;
  idRole?: number;
}
