import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllUnmatchedComponent } from './view-all-unmatched.component';

describe('ViewAllUnmatchedComponent', () => {
  let component: ViewAllUnmatchedComponent;
  let fixture: ComponentFixture<ViewAllUnmatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllUnmatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllUnmatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
