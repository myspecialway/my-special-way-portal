import { UserService } from './user.service';
import { of } from 'rxjs/observable/of';
import { throwError } from 'rxjs';

jest.mock('apollo-angular');
import { Apollo } from 'apollo-angular';

const apollo = new Apollo();

describe('user service tests', () => {
    let service: UserService;
    beforeEach(() => {
        service = new UserService(apollo);
    });

    it('should normalize allUsers response', async () => {
        (apollo.watchQuery as jest.Mock).mockReturnValue({valueChanges: of({data: {users: [{id: 1}]}})});
        expect(await service.getAllUsers().toPromise()).toEqual([{id: 1}]);
    });

    it('should return empty array when get users query fails', async () => {
        (apollo.watchQuery as jest.Mock).mockReturnValue({valueChanges: throwError('')});
        expect(await service.getAllUsers().toPromise()).toEqual([]);
    });
});
