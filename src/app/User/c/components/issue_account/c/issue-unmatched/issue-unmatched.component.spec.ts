import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueUnmatchedComponent } from './issue-unmatched.component';

describe('IssueUnmatchedComponent', () => {
  let component: IssueUnmatchedComponent;
  let fixture: ComponentFixture<IssueUnmatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueUnmatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueUnmatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
