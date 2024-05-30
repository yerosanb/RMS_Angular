import { TestBed } from '@angular/core/testing';

import { BtbReconService } from './btb-recon.service';

describe('BtbReconService', () => {
  let service: BtbReconService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BtbReconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
