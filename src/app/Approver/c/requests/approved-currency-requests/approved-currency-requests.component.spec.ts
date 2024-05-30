import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedCurrencyRequestsComponent } from './approved-currency-requests.component';

describe('ApprovedCurrencyRequestsComponent', () => {
  let component: ApprovedCurrencyRequestsComponent;
  let fixture: ComponentFixture<ApprovedCurrencyRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedCurrencyRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedCurrencyRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
