import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingCurrenciesComponent } from './pending-currencies.component';

describe('PendingCurrenciesComponent', () => {
  let component: PendingCurrenciesComponent;
  let fixture: ComponentFixture<PendingCurrenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingCurrenciesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingCurrenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
