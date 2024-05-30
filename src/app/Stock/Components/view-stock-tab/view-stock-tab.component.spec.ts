import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStockTabComponent } from './view-stock-tab.component';

describe('ViewStockTabComponent', () => {
  let component: ViewStockTabComponent;
  let fixture: ComponentFixture<ViewStockTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStockTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewStockTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
