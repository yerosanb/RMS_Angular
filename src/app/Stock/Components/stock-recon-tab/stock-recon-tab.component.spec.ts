import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockReconTabComponent } from './stock-recon-tab.component';

describe('StockReconTabComponent', () => {
  let component: StockReconTabComponent;
  let fixture: ComponentFixture<StockReconTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockReconTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockReconTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
