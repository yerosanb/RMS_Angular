import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFixedUnmatchedComponent } from './view-fixed-unmatched.component';

describe('ViewFixedUnmatchedComponent', () => {
  let component: ViewFixedUnmatchedComponent;
  let fixture: ComponentFixture<ViewFixedUnmatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFixedUnmatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFixedUnmatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
