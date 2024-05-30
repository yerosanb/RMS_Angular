import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPendingAccountsComponent } from './edit-pending-accounts.component';

describe('EditPendingAccountsComponent', () => {
  let component: EditPendingAccountsComponent;
  let fixture: ComponentFixture<EditPendingAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPendingAccountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPendingAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
