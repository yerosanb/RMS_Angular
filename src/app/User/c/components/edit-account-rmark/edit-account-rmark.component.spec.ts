import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccountRmarkComponent } from './edit-account-rmark.component';

describe('EditAccountRmarkComponent', () => {
  let component: EditAccountRmarkComponent;
  let fixture: ComponentFixture<EditAccountRmarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAccountRmarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAccountRmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
