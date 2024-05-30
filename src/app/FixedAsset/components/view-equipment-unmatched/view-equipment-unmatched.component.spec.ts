import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEquipmentUnmatchedComponent } from './view-equipment-unmatched.component';

describe('ViewEquipmentUnmatchedComponent', () => {
  let component: ViewEquipmentUnmatchedComponent;
  let fixture: ComponentFixture<ViewEquipmentUnmatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEquipmentUnmatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEquipmentUnmatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
