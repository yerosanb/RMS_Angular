import { TestBed } from '@angular/core/testing';

import { RoleFileUploadGuard } from './role-file-upload.guard';

describe('RoleFileUploadGuard', () => {
  let guard: RoleFileUploadGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleFileUploadGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
