import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApprovedRejectUserComponent } from './view-approved-reject-user.component';

describe('ViewApprovedRejectUserComponent', () => {
  let component: ViewApprovedRejectUserComponent;
  let fixture: ComponentFixture<ViewApprovedRejectUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewApprovedRejectUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewApprovedRejectUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
