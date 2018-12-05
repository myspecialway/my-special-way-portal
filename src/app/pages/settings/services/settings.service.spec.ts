import { SettingService } from './settings.service';
import { of } from 'rxjs/observable/of';
import { throwError } from 'rxjs';

jest.mock('apollo-angular');
import { Apollo } from 'apollo-angular';

const apollo = new Apollo();

describe('settings service tests', () => {
  let service: SettingService;
  beforeEach(() => {
    service = new SettingService(apollo);
  });

  it('should normalize allUsers response', async () => {
    (apollo.watchQuery as jest.Mock).mockReturnValue({
      valueChanges: of({ data: { settings: [{ teachercode: 1234 }] } }),
    });
    expect(await service.getAll().toPromise()).toEqual([{ teachercode: 1234 }]);
  });

  it('should return empty array when get users query fails', async () => {
    (apollo.watchQuery as jest.Mock).mockReturnValue({ valueChanges: throwError('') });
    expect(await service.getAll().toPromise()).toEqual([]);
  });

  it('should normalize update settings response', async () => {
    (apollo.mutate as jest.Mock).mockReturnValue(of({ teachercode: 23456 }));
    expect(
      await service.update({
        _id: '1234',
        teachercode: 23456,
      }),
    ).toEqual({ teachercode: 23456 });
  });
});
