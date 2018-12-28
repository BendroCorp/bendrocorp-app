import { TestBed, inject } from '@angular/core/testing';

import { LiabilitiesService } from './liabilities.service';

describe('LiabilitiesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LiabilitiesService]
    });
  });

  it('should be created', inject([LiabilitiesService], (service: LiabilitiesService) => {
    expect(service).toBeTruthy();
  }));
});
