import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewErcaMatchedComponent } from './view-erca-matched.component';

describe('ViewErcaMatchedComponent', () => {
  let component: ViewErcaMatchedComponent;
  let fixture: ComponentFixture<ViewErcaMatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewErcaMatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewErcaMatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
