/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { IssueAccountService } from './issue-account.service';

describe('Service: IssueAccount', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IssueAccountService]
    });
  });

  it('should ...', inject([IssueAccountService], (service: IssueAccountService) => {
    expect(service).toBeTruthy();
  }));
});
