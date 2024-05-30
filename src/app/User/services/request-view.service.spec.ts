import { TestBed } from '@angular/core/testing';

import { RequestViewService } from './request-view.service';

describe('RequestViewService', () => {
  let service: RequestViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
