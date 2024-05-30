import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMatchWithResonPayableComponent } from './view-match-with-reson-payable.component';

describe('ViewMatchWithResonPayableComponent', () => {
  let component: ViewMatchWithResonPayableComponent;
  let fixture: ComponentFixture<ViewMatchWithResonPayableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMatchWithResonPayableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMatchWithResonPayableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
