import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDropdownRoleComponent } from './multi-dropdown-role.component';

describe('MultiDropdownSubjectComponent', () => {
  let component: MultiDropdownRoleComponent;
  let fixture: ComponentFixture<MultiDropdownRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiDropdownRoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiDropdownRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
