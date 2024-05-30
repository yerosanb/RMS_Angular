import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEquipmentTabsComponent } from './view-equipment-tabs.component';

describe('ViewEquipmentTabsComponent', () => {
  let component: ViewEquipmentTabsComponent;
  let fixture: ComponentFixture<ViewEquipmentTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEquipmentTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEquipmentTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
