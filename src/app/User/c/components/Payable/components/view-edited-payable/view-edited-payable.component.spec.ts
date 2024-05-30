import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditedPayableComponent } from './view-edited-payable.component';

describe('ViewEditedPayableComponent', () => {
  let component: ViewEditedPayableComponent;
  let fixture: ComponentFixture<ViewEditedPayableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEditedPayableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEditedPayableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
