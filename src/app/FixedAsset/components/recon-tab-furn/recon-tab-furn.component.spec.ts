import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconTabFurnComponent } from './recon-tab-furn.component';

describe('ReconTabFurnComponent', () => {
  let component: ReconTabFurnComponent;
  let fixture: ComponentFixture<ReconTabFurnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconTabFurnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReconTabFurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
