import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewComputerMatchedComponent } from './view-computer-matched.component';

describe('ViewComputerMatchedComponent', () => {
  let component: ViewComputerMatchedComponent;
  let fixture: ComponentFixture<ViewComputerMatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewComputerMatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewComputerMatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
