import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableUnmatchComponent } from './payable-unmatch.component';

describe('PayableUnmatchComponent', () => {
  let component: PayableUnmatchComponent;
  let fixture: ComponentFixture<PayableUnmatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayableUnmatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayableUnmatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
