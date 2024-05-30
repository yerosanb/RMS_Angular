import { TestBed } from '@angular/core/testing';

import { FixedViewService } from './fixed-view.service';

describe('FixedViewService', () => {
  let service: FixedViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixedViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
