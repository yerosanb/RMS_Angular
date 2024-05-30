import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMatchingReasonComponent } from './view-matching-reason.component';

describe('ViewMatchingReasonComponent', () => {
  let component: ViewMatchingReasonComponent;
  let fixture: ComponentFixture<ViewMatchingReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMatchingReasonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMatchingReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
