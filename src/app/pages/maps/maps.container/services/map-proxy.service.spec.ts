import { TestBed, inject } from '@angular/core/testing';

import { MapProxyService } from './map-proxy.service';

describe('MapProxyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapProxyService],
    });
  });

  it('should be created', inject([MapProxyService], (service: MapProxyService) => {
    expect(service).toBeTruthy();
  }));
});
