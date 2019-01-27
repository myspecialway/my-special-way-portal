import { TestBed, inject } from '@angular/core/testing';

import { CommunicationService } from './communication.service';

describe('CommunicationService', () => {
  const sharedDataService = new CommunicationService();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommunicationService],
    });
  });

  it('should be created', inject([CommunicationService], (service: CommunicationService<any>) => {
    expect(service).toBeTruthy();
  }));

  it('should subscribe handlingMsgDataChanged event', () => {
    const spy = spyOn(sharedDataService.handlingMsgDataChanged, 'subscribe');
    sharedDataService.subscribeParantChanged(null, null);

    // then
    expect(sharedDataService.handlingMsgDataChanged.subscribe).toHaveBeenCalledWith(null, null);
  });

  it('should emit handlingMsgDataChanged event', () => {
    const handlingMsgData = { payload: 'blblba', type: 0 };
    const spy = spyOn(sharedDataService.handlingMsgDataChanged, 'emit');
    sharedDataService.emitEvent(handlingMsgData);

    // then
    expect(sharedDataService.handlingMsgDataChanged.emit).toHaveBeenCalledWith(handlingMsgData);
  });
});
