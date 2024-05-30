import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockManualComponent } from './stock-manual.component';

describe('StockManualComponent', () => {
  let component: StockManualComponent;
  let fixture: ComponentFixture<StockManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockManualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
