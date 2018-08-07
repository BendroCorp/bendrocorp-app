import { TestBed, inject } from '@angular/core/testing';

import { OffenderReportService } from './offender-report.service';

describe('OffenderReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OffenderReportService]
    });
  });

  it('should be created', inject([OffenderReportService], (service: OffenderReportService) => {
    expect(service).toBeTruthy();
  }));
});
