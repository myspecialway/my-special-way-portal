import { TestBed, inject, getTestBed } from '@angular/core/testing';

import { MapProxyService } from './map-proxy.service';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MapProxyService', () => {
  let authServiceMock: Partial<AuthenticationService>;
  // let httpMock: HttpTestingController;
  // let injector: TestBed;
  // let service: MapProxyService;
  beforeEach(() => {
    authServiceMock = {
      getTokenFromLocalStore: jest.fn().mockReturnValue('mockToken'),
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MapProxyService, { provide: AuthenticationService, useValue: authServiceMock }],
    });
    // injector = getTestBed();
    // service = injector.get(MapProxyService);
    // httpMock = injector.get(HttpTestingController);
  });

  it('should be created', inject([MapProxyService], (service: MapProxyService) => {
    expect(service).toBeTruthy();
  }));
});
