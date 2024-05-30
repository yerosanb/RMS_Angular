import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueCoreReversalMatchedComponent } from './issue-core-reversal-matched.component';

describe('IssueCoreReversalMatchedComponent', () => {
  let component: IssueCoreReversalMatchedComponent;
  let fixture: ComponentFixture<IssueCoreReversalMatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueCoreReversalMatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueCoreReversalMatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
