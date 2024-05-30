import { TestBed } from '@angular/core/testing';

import { RoleUserApproverGuard } from './role-user-approver.guard';

describe('RoleUserApproverGuard', () => {
  let guard: RoleUserApproverGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleUserApproverGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
