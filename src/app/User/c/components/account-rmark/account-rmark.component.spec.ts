import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRmarkComponent } from './account-rmark.component';

describe('AccountRmarkComponent', () => {
  let component: AccountRmarkComponent;
  let fixture: ComponentFixture<AccountRmarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountRmarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountRmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
