import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDropdownSubjectComponent } from './multi-dropdown-subject.component';

describe('MultiDropdownSubjectComponent', () => {
  let component: MultiDropdownSubjectComponent;
  let fixture: ComponentFixture<MultiDropdownSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiDropdownSubjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiDropdownSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
