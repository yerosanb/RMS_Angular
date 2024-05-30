import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedAccountsComponent } from './approved-accounts.component';

describe('ApprovedAccountsComponent', () => {
  let component: ApprovedAccountsComponent;
  let fixture: ComponentFixture<ApprovedAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedAccountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
