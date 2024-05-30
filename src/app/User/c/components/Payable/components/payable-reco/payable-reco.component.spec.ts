import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableRecoComponent } from './payable-reco.component';

describe('PayableRecoComponent', () => {
  let component: PayableRecoComponent;
  let fixture: ComponentFixture<PayableRecoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayableRecoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayableRecoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
