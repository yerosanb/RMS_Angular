import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedCurrencyRequestsComponent } from './rejected-currency-requests.component';

describe('RejectedCurrencyRequestsComponent', () => {
  let component: RejectedCurrencyRequestsComponent;
  let fixture: ComponentFixture<RejectedCurrencyRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedCurrencyRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedCurrencyRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
