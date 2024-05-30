import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditedIssueCoreComponent } from './edited-issue-core.component';

describe('EditedIssueCoreComponent', () => {
  let component: EditedIssueCoreComponent;
  let fixture: ComponentFixture<EditedIssueCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditedIssueCoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditedIssueCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
