import { TestBed } from '@angular/core/testing';

import { ReceivableServiceService } from './receivable-service.service';

describe('ReceivableServiceService', () => {
  let service: ReceivableServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceivableServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
