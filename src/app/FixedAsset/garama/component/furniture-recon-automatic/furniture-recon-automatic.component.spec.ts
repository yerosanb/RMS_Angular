import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FurnitureReconAutomaticComponent } from './furniture-recon-automatic.component';

describe('FurnitureReconAutomaticComponent', () => {
  let component: FurnitureReconAutomaticComponent;
  let fixture: ComponentFixture<FurnitureReconAutomaticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FurnitureReconAutomaticComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FurnitureReconAutomaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
