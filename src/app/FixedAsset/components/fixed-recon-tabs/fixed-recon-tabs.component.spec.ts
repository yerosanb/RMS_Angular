import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedReconTabsComponent } from './fixed-recon-tabs.component';

describe('FixedReconTabsComponent', () => {
  let component: FixedReconTabsComponent;
  let fixture: ComponentFixture<FixedReconTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixedReconTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedReconTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
