import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCurrencyRemarkComponent } from './edit-currency-remark.component';

describe('EditCurrencyRemarkComponent', () => {
  let component: EditCurrencyRemarkComponent;
  let fixture: ComponentFixture<EditCurrencyRemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCurrencyRemarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCurrencyRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
