import { TestBed, inject } from '@angular/core/testing';

import { ApiOfflineService } from './api-offline.service';

describe('ApiOfflineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiOfflineService]
    });
  });

  it('should be created', inject([ApiOfflineService], (service: ApiOfflineService) => {
    expect(service).toBeTruthy();
  }));
});
