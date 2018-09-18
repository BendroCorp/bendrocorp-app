import { TestBed, inject } from '@angular/core/testing';

import { IsAuthorizedService } from './is-authorized.service';

describe('IsAuthorizedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsAuthorizedService]
    });
  });

  it('should be created', inject([IsAuthorizedService], (service: IsAuthorizedService) => {
    expect(service).toBeTruthy();
  }));
});
