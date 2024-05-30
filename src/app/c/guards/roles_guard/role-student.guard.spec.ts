import { TestBed } from '@angular/core/testing';

import { RoleStudentGuard } from './role-student.guard';

describe('RoleStudentGuard', () => {
  let guard: RoleStudentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleStudentGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
