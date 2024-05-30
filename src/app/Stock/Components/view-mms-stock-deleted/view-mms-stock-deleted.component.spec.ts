import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMmsStockDeletedComponent } from './view-mms-stock-deleted.component';

describe('ViewMmsStockDeletedComponent', () => {
  let component: ViewMmsStockDeletedComponent;
  let fixture: ComponentFixture<ViewMmsStockDeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMmsStockDeletedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMmsStockDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
