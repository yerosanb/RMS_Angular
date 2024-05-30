import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewComputerTabsComponent } from './view-computer-tabs.component';

describe('ViewComputerTabsComponent', () => {
  let component: ViewComputerTabsComponent;
  let fixture: ComponentFixture<ViewComputerTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewComputerTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewComputerTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
