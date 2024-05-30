import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableMatchedComponent } from './payable-matched.component';

describe('PayableMatchedComponent', () => {
  let component: PayableMatchedComponent;
  let fixture: ComponentFixture<PayableMatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayableMatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayableMatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
