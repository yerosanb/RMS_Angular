import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconManualComputerComponent } from './recon-manual-computer.component';

describe('ReconManualComputerComponent', () => {
  let component: ReconManualComputerComponent;
  let fixture: ComponentFixture<ReconManualComputerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconManualComputerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReconManualComputerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
