import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCurrencyRequestComponent } from './view-currency-request.component';

describe('ViewCurrencyRequestComponent', () => {
  let component: ViewCurrencyRequestComponent;
  let fixture: ComponentFixture<ViewCurrencyRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCurrencyRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCurrencyRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
