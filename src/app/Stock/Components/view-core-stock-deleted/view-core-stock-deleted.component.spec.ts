import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCoreStockDeletedComponent } from './view-core-stock-deleted.component';

describe('ViewCoreStockDeletedComponent', () => {
  let component: ViewCoreStockDeletedComponent;
  let fixture: ComponentFixture<ViewCoreStockDeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCoreStockDeletedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCoreStockDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
