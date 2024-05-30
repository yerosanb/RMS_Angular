/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReconcileService } from './reconcile.service';

describe('Service: Reconcile', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReconcileService]
    });
  });

  it('should ...', inject([ReconcileService], (service: ReconcileService) => {
    expect(service).toBeTruthy();
  }));
});
