import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVehicleTabsComponent } from './view-vehicle-tabs.component';

describe('ViewVehicleTabsComponent', () => {
  let component: ViewVehicleTabsComponent;
  let fixture: ComponentFixture<ViewVehicleTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewVehicleTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewVehicleTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
