import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedCurrenciesComponent } from './approved-currencies.component';

describe('ApprovedCurrenciesComponent', () => {
  let component: ApprovedCurrenciesComponent;
  let fixture: ComponentFixture<ApprovedCurrenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedCurrenciesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedCurrenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
