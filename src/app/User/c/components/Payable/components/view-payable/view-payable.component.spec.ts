import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPayableComponent } from './view-payable.component';

describe('ViewPayableComponent', () => {
  let component: ViewPayableComponent;
  let fixture: ComponentFixture<ViewPayableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPayableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPayableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
