import { TestBed } from '@angular/core/testing';

import { RoleFixedAssetGuard } from './role-fixed-asset.guard';

describe('RoleFixedAssetGuard', () => {
  let guard: RoleFixedAssetGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleFixedAssetGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
