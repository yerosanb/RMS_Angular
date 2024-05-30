import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFurnitureTabsComponent } from './view-furniture-tabs.component';

describe('ViewFurnitureTabsComponent', () => {
  let component: ViewFurnitureTabsComponent;
  let fixture: ComponentFixture<ViewFurnitureTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFurnitureTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFurnitureTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
