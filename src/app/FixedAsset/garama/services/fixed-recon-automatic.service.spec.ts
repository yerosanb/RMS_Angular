import { TestBed } from '@angular/core/testing';

import { FixedReconAutomaticService } from './fixed-recon-automatic.service';

describe('FixedReconAutomaticService', () => {
  let service: FixedReconAutomaticService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixedReconAutomaticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
