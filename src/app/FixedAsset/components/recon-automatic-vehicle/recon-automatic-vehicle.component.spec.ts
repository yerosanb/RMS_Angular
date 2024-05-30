import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconAutomaticVehicleComponent } from './recon-automatic-vehicle.component';

describe('ReconAutomaticVehicleComponent', () => {
  let component: ReconAutomaticVehicleComponent;
  let fixture: ComponentFixture<ReconAutomaticVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconAutomaticVehicleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReconAutomaticVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
