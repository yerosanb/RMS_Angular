import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovePendingUserComponent } from './approve-pending-user.component';

describe('ApprovePendingUserComponent', () => {
  let component: ApprovePendingUserComponent;
  let fixture: ComponentFixture<ApprovePendingUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovePendingUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovePendingUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
