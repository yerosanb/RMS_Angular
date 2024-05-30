import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingAccountsComponent } from './pending-accounts.component';

describe('PendingAccountsComponent', () => {
  let component: PendingAccountsComponent;
  let fixture: ComponentFixture<PendingAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingAccountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
