import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableReconcileComponent } from './payable-reconcile.component';

describe('PayableReconcileComponent', () => {
  let component: PayableReconcileComponent;
  let fixture: ComponentFixture<PayableReconcileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayableReconcileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayableReconcileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
