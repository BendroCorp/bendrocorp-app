import { TestBed, inject } from '@angular/core/testing';

import { SystemMapService } from './system-map.service';

describe('SystemMapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SystemMapService]
    });
  });

  it('should be created', inject([SystemMapService], (service: SystemMapService) => {
    expect(service).toBeTruthy();
  }));
});
