import { TestBed, inject } from '@angular/core/testing';

import { FlightLogService } from './flight-log.service';

describe('FlightLogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlightLogService]
    });
  });

  it('should be created', inject([FlightLogService], (service: FlightLogService) => {
    expect(service).toBeTruthy();
  }));
});
