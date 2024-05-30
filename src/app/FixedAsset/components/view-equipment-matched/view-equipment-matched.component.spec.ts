import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEquipmentMatchedComponent } from './view-equipment-matched.component';

describe('ViewEquipmentMatchedComponent', () => {
  let component: ViewEquipmentMatchedComponent;
  let fixture: ComponentFixture<ViewEquipmentMatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEquipmentMatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEquipmentMatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
