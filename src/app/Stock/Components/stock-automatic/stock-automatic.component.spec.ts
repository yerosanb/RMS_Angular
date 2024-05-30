import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAutomaticComponent } from './stock-automatic.component';

describe('StockAutomaticComponent', () => {
  let component: StockAutomaticComponent;
  let fixture: ComponentFixture<StockAutomaticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockAutomaticComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockAutomaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
