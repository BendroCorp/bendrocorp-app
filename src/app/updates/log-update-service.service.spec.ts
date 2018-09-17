import { TestBed, inject } from '@angular/core/testing';

import { LogUpdateService } from './log-update-service.service';

describe('LogUpdateServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogUpdateService]
    });
  });

  it('should be created', inject([LogUpdateService], (service: LogUpdateService) => {
    expect(service).toBeTruthy();
  }));
});
