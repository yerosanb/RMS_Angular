import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllMatchedComponent } from './view-all-matched.component';

describe('ViewAllMatchedComponent', () => {
  let component: ViewAllMatchedComponent;
  let fixture: ComponentFixture<ViewAllMatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllMatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllMatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
