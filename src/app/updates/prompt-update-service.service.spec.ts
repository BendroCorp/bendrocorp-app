import { TestBed, inject } from '@angular/core/testing';

import { PromptUpdateService } from './prompt-update-service.service';

describe('PromptUpdateServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PromptUpdateService]
    });
  });

  it('should be created', inject([PromptUpdateService], (service: PromptUpdateService) => {
    expect(service).toBeTruthy();
  }));
});
