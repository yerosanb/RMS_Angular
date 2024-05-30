import { TestBed } from '@angular/core/testing';

import { RoleTeacherStudentGuard } from './role-teacher-student.guard';

describe('RoleTeacherStudentGuard', () => {
  let guard: RoleTeacherStudentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleTeacherStudentGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
