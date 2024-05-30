import { TestBed } from '@angular/core/testing';

import { StokeService } from './stoke.service';

describe('StokeService', () => {
  let service: StokeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StokeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
