import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStockeMatchedComponent } from './view-stocke-matched.component';

describe('ViewStockeMatchedComponent', () => {
  let component: ViewStockeMatchedComponent;
  let fixture: ComponentFixture<ViewStockeMatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStockeMatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewStockeMatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
