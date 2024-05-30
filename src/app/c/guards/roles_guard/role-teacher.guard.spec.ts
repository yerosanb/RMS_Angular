import { TestBed } from '@angular/core/testing';

import { RoleTeacherGuard } from './role-teacher.guard';

describe('RoleTeacherGuard', () => {
  let guard: RoleTeacherGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleTeacherGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
