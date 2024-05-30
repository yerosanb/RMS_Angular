import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVehicleUnmatchedComponent } from './view-vehicle-unmatched.component';

describe('ViewVehicleUnmatchedComponent', () => {
  let component: ViewVehicleUnmatchedComponent;
  let fixture: ComponentFixture<ViewVehicleUnmatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewVehicleUnmatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewVehicleUnmatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
