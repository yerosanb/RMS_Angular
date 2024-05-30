import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPendingCurrenciesComponent } from './edit-pending-currencies.component';

describe('EditPendingCurrenciesComponent', () => {
  let component: EditPendingCurrenciesComponent;
  let fixture: ComponentFixture<EditPendingCurrenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPendingCurrenciesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPendingCurrenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
