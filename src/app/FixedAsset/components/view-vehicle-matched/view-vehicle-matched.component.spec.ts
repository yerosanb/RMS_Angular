import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVehicleMatchedComponent } from './view-vehicle-matched.component';

describe('ViewVehicleMatchedComponent', () => {
  let component: ViewVehicleMatchedComponent;
  let fixture: ComponentFixture<ViewVehicleMatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewVehicleMatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewVehicleMatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
