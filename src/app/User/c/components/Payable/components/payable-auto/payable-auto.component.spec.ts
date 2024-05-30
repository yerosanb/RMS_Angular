import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableAutoComponent } from './payable-auto.component';

describe('PayableAutoComponent', () => {
  let component: PayableAutoComponent;
  let fixture: ComponentFixture<PayableAutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayableAutoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayableAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
