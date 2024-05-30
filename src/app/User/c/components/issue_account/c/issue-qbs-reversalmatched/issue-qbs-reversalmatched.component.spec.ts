import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueQbsReversalmatchedComponent } from './issue-qbs-reversalmatched.component';

describe('IssueQbsReversalmatchedComponent', () => {
  let component: IssueQbsReversalmatchedComponent;
  let fixture: ComponentFixture<IssueQbsReversalmatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueQbsReversalmatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueQbsReversalmatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
