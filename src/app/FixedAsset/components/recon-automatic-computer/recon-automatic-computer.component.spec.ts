import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconAutomaticComputerComponent } from './recon-automatic-computer.component';

describe('ReconAutomaticComputerComponent', () => {
  let component: ReconAutomaticComputerComponent;
  let fixture: ComponentFixture<ReconAutomaticComputerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconAutomaticComputerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReconAutomaticComputerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
