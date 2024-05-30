import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRemarkReplayComponent } from './account-remark-replay.component';

describe('AccountRemarkReplayComponent', () => {
  let component: AccountRemarkReplayComponent;
  let fixture: ComponentFixture<AccountRemarkReplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountRemarkReplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountRemarkReplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
