import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMatchWithReasonComponent } from './view-match-with-reason.component';

describe('ViewMatchWithReasonComponent', () => {
  let component: ViewMatchWithReasonComponent;
  let fixture: ComponentFixture<ViewMatchWithReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMatchWithReasonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMatchWithReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
