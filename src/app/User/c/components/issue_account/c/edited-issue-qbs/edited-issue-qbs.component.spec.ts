import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditedIssueQbsComponent } from './edited-issue-qbs.component';

describe('EditedIssueQbsComponent', () => {
  let component: EditedIssueQbsComponent;
  let fixture: ComponentFixture<EditedIssueQbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditedIssueQbsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditedIssueQbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
