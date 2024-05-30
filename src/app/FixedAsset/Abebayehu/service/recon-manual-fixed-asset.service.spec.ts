import { TestBed } from '@angular/core/testing';

import { ReconManualFixedAssetService } from './recon-manual-fixed-asset.service';

describe('ReconManualFixedAssetService', () => {
  let service: ReconManualFixedAssetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReconManualFixedAssetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
