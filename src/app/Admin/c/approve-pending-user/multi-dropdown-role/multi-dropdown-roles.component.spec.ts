import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDropdownRolesComponent } from './multi-dropdown-roles.component';

describe('MultiDropdownSubjectComponent', () => {
  let component: MultiDropdownRolesComponent;
  let fixture: ComponentFixture<MultiDropdownRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiDropdownRolesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiDropdownRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
