import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedAccountRequestsComponent } from './approved-account-requests.component';

describe('ApprovedAccountRequestsComponent', () => {
  let component: ApprovedAccountRequestsComponent;
  let fixture: ComponentFixture<ApprovedAccountRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedAccountRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedAccountRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
