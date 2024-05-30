import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockUnmatchedComponent } from './stock-unmatched.component';

describe('StockUnmatchedComponent', () => {
  let component: StockUnmatchedComponent;
  let fixture: ComponentFixture<StockUnmatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockUnmatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockUnmatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
