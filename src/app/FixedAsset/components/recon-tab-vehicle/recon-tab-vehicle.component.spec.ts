import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconTabVehicleComponent } from './recon-tab-vehicle.component';

describe('ReconTabVehicleComponent', () => {
  let component: ReconTabVehicleComponent;
  let fixture: ComponentFixture<ReconTabVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconTabVehicleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReconTabVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
