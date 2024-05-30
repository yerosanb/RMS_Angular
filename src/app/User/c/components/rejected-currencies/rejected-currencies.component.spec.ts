import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedCurrenciesComponent } from './rejected-currencies.component';

describe('RejectedCurrenciesComponent', () => {
  let component: RejectedCurrenciesComponent;
  let fixture: ComponentFixture<RejectedCurrenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedCurrenciesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedCurrenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
