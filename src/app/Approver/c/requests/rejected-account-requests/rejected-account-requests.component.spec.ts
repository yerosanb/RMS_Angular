import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedAccountRequestsComponent } from './rejected-account-requests.component';

describe('RejectedAccountRequestsComponent', () => {
  let component: RejectedAccountRequestsComponent;
  let fixture: ComponentFixture<RejectedAccountRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedAccountRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedAccountRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
