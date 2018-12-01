import { TestBed, inject } from '@angular/core/testing';

import { SiteLogService } from './site-log.service';

describe('SiteLogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SiteLogService]
    });
  });

  it('should be created', inject([SiteLogService], (service: SiteLogService) => {
    expect(service).toBeTruthy();
  }));
});
