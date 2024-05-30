import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFurnitureUnmatchedComponent } from './view-furniture-unmatched.component';

describe('ViewFurnitureUnmatchedComponent', () => {
  let component: ViewFurnitureUnmatchedComponent;
  let fixture: ComponentFixture<ViewFurnitureUnmatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFurnitureUnmatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFurnitureUnmatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
