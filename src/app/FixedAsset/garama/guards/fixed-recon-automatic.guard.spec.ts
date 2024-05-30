import { TestBed } from '@angular/core/testing';

import { FixedReconAutomaticGuard } from './fixed-recon-automatic.guard';

describe('FixedReconAutomaticGuard', () => {
  let guard: FixedReconAutomaticGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FixedReconAutomaticGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
