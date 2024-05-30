import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivableMatchedComponent } from './receivable-matched.component';

describe('ReceivableMatchedComponent', () => {
  let component: ReceivableMatchedComponent;
  let fixture: ComponentFixture<ReceivableMatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivableMatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivableMatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
