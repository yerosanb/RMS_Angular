import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllPartiallyMatchedComponent } from './view-all-partially-matched.component';

describe('ViewAllPartiallyMatchedComponent', () => {
  let component: ViewAllPartiallyMatchedComponent;
  let fixture: ComponentFixture<ViewAllPartiallyMatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllPartiallyMatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllPartiallyMatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
