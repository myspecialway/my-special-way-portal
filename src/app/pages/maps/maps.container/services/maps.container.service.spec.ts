import { of } from 'rxjs/observable/of';
jest.mock('apollo-angular');
import { Apollo } from 'apollo-angular';
import { BlockedSectionsService } from './maps.container.service';

const apollo = new Apollo();

describe('Maps service ', () => {
  let service: BlockedSectionsService;
  beforeEach(() => {
    service = new BlockedSectionsService(apollo);
  });

  it('should normalize allblockedSections response', async () => {
    (apollo.watchQuery as jest.Mock).mockReturnValue({ valueChanges: of({ data: { blockedSections: [{ id: 1 }] } }) });
    expect(await service.getBlockSectionsByLocations().toPromise()).toEqual([{ id: 1 }]);
  });

  it('should return updated blocked section response', async () => {
    (apollo.watchQuery as jest.Mock).mockReturnValue({ valueChanges: of({ data: { blockedSections: [{ id: 1 }] } }) });
    (apollo.mutate as jest.Mock).mockReturnValue(of({ data: { updateBlockedSection: { _id: '1' } } }));
    const blockedSection = {
      reason: "מרתון תל אביב'",
      from: 'A',
      to: 'B',
    };
    expect(await service.update('1', blockedSection)).toEqual('1');
  });

  it('should return deleted blocked section response', async () => {
    (apollo.watchQuery as jest.Mock).mockReturnValue({ valueChanges: of({ data: { blockedSections: [{ id: 1 }] } }) });
    (apollo.mutate as jest.Mock).mockReturnValue(of({ data: { deleteBlockedSection: { _id: '1' } } }));

    expect(await service.delete(1)).toEqual('1');
  });

  it('should return created blocked section response when calling create', async () => {
    (apollo.mutate as jest.Mock).mockReturnValue(of({ _id: '6' }));
    expect(
      await service.create({
        reason: "מרתון תל אביב'",
        from: 'A',
        to: 'B',
      }),
    ).toEqual({ _id: '6' });
  });
});
