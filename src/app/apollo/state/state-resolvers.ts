import { JWTTokenPayloadResponse } from '../../models/jwt-token-resonse.model';
import { UserType } from '../../models/user.model';

export const updateUserProfile = (_, { userProfile }, { cache }) => {
  cache.writeData({
    data: {
      userProfile: {
        ...userProfile,
        __typename: 'UserProfile',
      },
    },
  });
};

export const defaultUserProfile = {
  username: null,
  role: null,
  token: null,
  __typename: 'UserProfile',
};

export class UserProfileStateModel {
  username: string;
  firstname: string;
  lastname: string;
  role: UserType;
  token: string;

  constructor(jwtParsedToken: JWTTokenPayloadResponse) {
    Object.assign(this, {
      ...jwtParsedToken,
    });
  }
}
