import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReceivableComponent } from './view-receivable.component';

describe('ViewReceivableComponent', () => {
  let component: ViewReceivableComponent;
  let fixture: ComponentFixture<ViewReceivableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewReceivableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
