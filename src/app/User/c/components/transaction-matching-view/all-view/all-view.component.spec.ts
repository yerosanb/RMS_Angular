import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllViewComponent } from './all-view.component';

describe('AllViewComponent', () => {
  let component: AllViewComponent;
  let fixture: ComponentFixture<AllViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
