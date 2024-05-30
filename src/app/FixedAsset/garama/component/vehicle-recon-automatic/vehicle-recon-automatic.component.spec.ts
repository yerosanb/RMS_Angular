import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleReconAutomaticComponent } from './vehicle-recon-automatic.component';

describe('VehicleReconAutomaticComponent', () => {
  let component: VehicleReconAutomaticComponent;
  let fixture: ComponentFixture<VehicleReconAutomaticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleReconAutomaticComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleReconAutomaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
