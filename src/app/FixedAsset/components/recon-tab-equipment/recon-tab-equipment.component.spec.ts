import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconTabEquipmentComponent } from './recon-tab-equipment.component';

describe('ReconTabEquipmentComponent', () => {
  let component: ReconTabEquipmentComponent;
  let fixture: ComponentFixture<ReconTabEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconTabEquipmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReconTabEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
