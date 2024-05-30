import { TestBed } from '@angular/core/testing';

import { ViewReasonService } from './view-reason.service';

describe('ViewReasonService', () => {
  let service: ViewReasonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewReasonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
