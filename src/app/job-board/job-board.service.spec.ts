import { TestBed, inject } from '@angular/core/testing';

import { JobBoardService } from './job-board.service';

describe('JobBoardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobBoardService]
    });
  });

  it('should be created', inject([JobBoardService], (service: JobBoardService) => {
    expect(service).toBeTruthy();
  }));
});
