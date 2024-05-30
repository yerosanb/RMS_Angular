import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCurrencyRemarkComponent } from './send-currency-remark.component';

describe('SendCurrencyRemarkComponent', () => {
  let component: SendCurrencyRemarkComponent;
  let fixture: ComponentFixture<SendCurrencyRemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendCurrencyRemarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendCurrencyRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
