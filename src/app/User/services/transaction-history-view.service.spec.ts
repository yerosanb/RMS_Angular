import { TestBed } from '@angular/core/testing';

import { TransactionHistoryViewService } from './transaction-history-view.service';

describe('TransactionHistoryViewService', () => {
  let service: TransactionHistoryViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionHistoryViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
