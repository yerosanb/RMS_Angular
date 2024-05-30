import { TestBed } from '@angular/core/testing';

import { RoleApproverGuard } from './role-approver.guard';

describe('RoleApproverGuard', () => {
  let guard: RoleApproverGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleApproverGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
