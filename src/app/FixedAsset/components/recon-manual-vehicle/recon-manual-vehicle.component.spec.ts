import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconManualVehicleComponent } from './recon-manual-vehicle.component';

describe('ReconManualVehicleComponent', () => {
  let component: ReconManualVehicleComponent;
  let fixture: ComponentFixture<ReconManualVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconManualVehicleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReconManualVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
