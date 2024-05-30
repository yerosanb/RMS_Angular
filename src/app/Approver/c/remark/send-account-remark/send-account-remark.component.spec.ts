import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendAccountRemarkComponent } from './send-account-remark.component';

describe('SendAccountRemarkComponent', () => {
  let component: SendAccountRemarkComponent;
  let fixture: ComponentFixture<SendAccountRemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendAccountRemarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendAccountRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
