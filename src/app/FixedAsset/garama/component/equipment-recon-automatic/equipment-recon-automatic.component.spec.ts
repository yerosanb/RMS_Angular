import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentReconAutomaticComponent } from './equipment-recon-automatic.component';

describe('EquipmentReconAutomaticComponent', () => {
  let component: EquipmentReconAutomaticComponent;
  let fixture: ComponentFixture<EquipmentReconAutomaticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipmentReconAutomaticComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentReconAutomaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
