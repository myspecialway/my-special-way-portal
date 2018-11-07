import { FirstloginService } from './firstlogin.service';
import { of } from 'rxjs/observable/of';
import { throwError } from 'rxjs';

jest.mock('apollo-angular');
import { Apollo } from 'apollo-angular';
import { UserType } from '../../../models/user.model';

const apollo = new Apollo();

describe('user service tests', () => {
  let service: FirstloginService;
  beforeEach(() => {
    service = new FirstloginService(apollo);
  });

  it('should return update user response updatePassword', async () => {
    (apollo.mutate as jest.Mock).mockReturnValue(of({ _id: '12' }));
    expect(await service.updateUserPassword(12, '1234567')).toEqual({ _id: '12' });
  });
});
