import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueMatchedComponent } from './issue-matched.component';

describe('IssueMatchedComponent', () => {
  let component: IssueMatchedComponent;
  let fixture: ComponentFixture<IssueMatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueMatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueMatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
