import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconManualFurnitureComponent } from './recon-manual-furniture.component';

describe('ReconManualFurnitureComponent', () => {
  let component: ReconManualFurnitureComponent;
  let fixture: ComponentFixture<ReconManualFurnitureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconManualFurnitureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReconManualFurnitureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
