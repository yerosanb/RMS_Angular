import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconAutomaticEquipmentComponent } from './recon-automatic-equipment.component';

describe('ReconAutomaticEquipmentComponent', () => {
  let component: ReconAutomaticEquipmentComponent;
  let fixture: ComponentFixture<ReconAutomaticEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconAutomaticEquipmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReconAutomaticEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
