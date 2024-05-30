import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconAutomaticFurnitureComponent } from './recon-automatic-furniture.component';

describe('ReconAutomaticFurnitureComponent', () => {
  let component: ReconAutomaticFurnitureComponent;
  let fixture: ComponentFixture<ReconAutomaticFurnitureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconAutomaticFurnitureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReconAutomaticFurnitureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
