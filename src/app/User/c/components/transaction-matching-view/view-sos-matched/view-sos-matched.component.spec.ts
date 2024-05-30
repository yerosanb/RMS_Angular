import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSosMatchedComponent } from './view-sos-matched.component';

describe('ViewSosMatchedComponent', () => {
  let component: ViewSosMatchedComponent;
  let fixture: ComponentFixture<ViewSosMatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSosMatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSosMatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
