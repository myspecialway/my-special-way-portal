import { UserType } from './user.model';

export interface JWTTokenPayloadResponse {
  username: string;
  firstname: string;
  lastname: string;
  role: UserType;
  class_id?: string;
}
