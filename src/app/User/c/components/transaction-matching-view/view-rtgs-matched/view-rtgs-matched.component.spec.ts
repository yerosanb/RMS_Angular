import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRtgsMatchedComponent } from './view-rtgs-matched.component';

describe('ViewRtgsMatchedComponent', () => {
  let component: ViewRtgsMatchedComponent;
  let fixture: ComponentFixture<ViewRtgsMatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRtgsMatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRtgsMatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
