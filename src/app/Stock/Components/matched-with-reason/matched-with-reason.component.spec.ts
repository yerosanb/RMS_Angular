import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchedWithReasonComponent } from './matched-with-reason.component';

describe('MatchedWithReasonComponent', () => {
  let component: MatchedWithReasonComponent;
  let fixture: ComponentFixture<MatchedWithReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchedWithReasonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchedWithReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
