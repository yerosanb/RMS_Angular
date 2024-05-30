import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyRemarkEditComponent } from './currency-remark-edit.component';

describe('CurrencyRemarkEditComponent', () => {
  let component: CurrencyRemarkEditComponent;
  let fixture: ComponentFixture<CurrencyRemarkEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyRemarkEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyRemarkEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
