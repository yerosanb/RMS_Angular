import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBtbMatchedComponent } from './view-btb-matched.component';

describe('ViewBtbMatchedComponent', () => {
  let component: ViewBtbMatchedComponent;
  let fixture: ComponentFixture<ViewBtbMatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBtbMatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBtbMatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
