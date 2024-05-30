import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconManualEquipmentComponent } from './recon-manual-equipment.component';

describe('ReconManualEquipmentComponent', () => {
  let component: ReconManualEquipmentComponent;
  let fixture: ComponentFixture<ReconManualEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconManualEquipmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReconManualEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
