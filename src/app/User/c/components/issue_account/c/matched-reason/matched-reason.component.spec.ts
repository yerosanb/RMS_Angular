import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchedReasonComponent } from './matched-reason.component';

describe('MatchedReasonComponent', () => {
  let component: MatchedReasonComponent;
  let fixture: ComponentFixture<MatchedReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchedReasonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchedReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
