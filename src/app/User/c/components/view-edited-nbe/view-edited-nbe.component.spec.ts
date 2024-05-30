import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditedNBEComponent } from './view-edited-nbe.component';

describe('ViewEditedNBEComponent', () => {
  let component: ViewEditedNBEComponent;
  let fixture: ComponentFixture<ViewEditedNBEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEditedNBEComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEditedNBEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
