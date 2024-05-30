import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFurnitureMatchedComponent } from './view-furniture-matched.component';

describe('ViewFurnitureMatchedComponent', () => {
  let component: ViewFurnitureMatchedComponent;
  let fixture: ComponentFixture<ViewFurnitureMatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFurnitureMatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFurnitureMatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
