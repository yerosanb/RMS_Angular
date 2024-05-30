import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditedCoreComponent } from './view-edited-core.component';

describe('ViewEditedCoreComponent', () => {
  let component: ViewEditedCoreComponent;
  let fixture: ComponentFixture<ViewEditedCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEditedCoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEditedCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
