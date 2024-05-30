import { TestBed } from '@angular/core/testing';

import { ReconViewService } from './recon-view.service';

describe('ReconViewService', () => {
  let service: ReconViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReconViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
