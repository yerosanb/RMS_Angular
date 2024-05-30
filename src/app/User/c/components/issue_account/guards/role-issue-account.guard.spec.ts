import { TestBed } from '@angular/core/testing';

import { RoleIssueAccountGuard } from './role-issue-account.guard';

describe('RoleIssueAccountGuard', () => {
  let guard: RoleIssueAccountGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleIssueAccountGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
