import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIssueTransactionComponent } from './view-issue-transaction.component';

describe('ViewIssueTransactionComponent', () => {
  let component: ViewIssueTransactionComponent;
  let fixture: ComponentFixture<ViewIssueTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewIssueTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewIssueTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
