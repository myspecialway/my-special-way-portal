import { UserService } from './user.service';
import { of } from 'rxjs/observable/of';
import { throwError } from 'rxjs';

jest.mock('apollo-angular');
import { Apollo } from 'apollo-angular';
import { UserType } from '../../../models/user.model';

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

    it('should return user without changes when calling getById', async () => {
        (apollo.query as jest.Mock).mockReturnValue(of({_id: '234123'}));
        expect(await service.getById(21)).toEqual({_id: '234123'});
    });

    it('should return delete user response without changes when calling delete', async () => {
        (apollo.mutate as jest.Mock).mockReturnValue(of({}));
        expect(await service.delete(21)).toEqual({});
    });

    it('should return created user response without changes when calling create', async () => {
        (apollo.mutate as jest.Mock).mockReturnValue(of({_id: '1111'}));
        expect(await service.create({
            email: 'a',
            firstname: 'a',
            lastname: 'a',
            password: 'a',
            role: UserType.PRINCIPLE,
            username: 'a',
            _id: 0,
        })).toEqual({_id: '1111'});
    });

    it('should return update user response without changes when calling update', async () => {
        (apollo.mutate as jest.Mock).mockReturnValue(of({_id: '12'}));
        expect(await service.update({
            email: 'a',
            firstname: 'a',
            lastname: 'a',
            password: 'a',
            role: UserType.PRINCIPLE,
            username: 'a',
            _id: 0,
        })).toEqual({_id: '12'});
    });
});
