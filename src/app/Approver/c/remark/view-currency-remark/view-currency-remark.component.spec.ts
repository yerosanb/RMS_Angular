import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCurrencyRemarkComponent } from './view-currency-remark.component';

describe('ViewCurrencyRemarkComponent', () => {
  let component: ViewCurrencyRemarkComponent;
  let fixture: ComponentFixture<ViewCurrencyRemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCurrencyRemarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCurrencyRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
