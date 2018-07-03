import { JWTTokenPayloadResponse } from '../models/jwt-token-resonse.model';
import { InMemoryCache } from 'apollo-cache-inmemory';

export const updateUserProfile = (_, { userProfile }: { userProfile: UserProfileStateModel }, { cache }: { cache: InMemoryCache }) => {
  console.log('');
  cache.writeData({
    data: { userProfile },
  });
  return userProfile;
};

export class UserProfileStateModel {
  username: string;
  firstname: string;
  lastname: string;
}
