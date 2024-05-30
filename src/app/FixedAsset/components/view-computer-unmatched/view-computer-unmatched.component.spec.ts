import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewComputerUnmatchedComponent } from './view-computer-unmatched.component';

describe('ViewComputerUnmatchedComponent', () => {
  let component: ViewComputerUnmatchedComponent;
  let fixture: ComponentFixture<ViewComputerUnmatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewComputerUnmatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewComputerUnmatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
