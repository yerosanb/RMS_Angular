import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockReversalComponent } from './stock-reversal.component';

describe('StockReversalComponent', () => {
  let component: StockReversalComponent;
  let fixture: ComponentFixture<StockReversalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockReversalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockReversalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
