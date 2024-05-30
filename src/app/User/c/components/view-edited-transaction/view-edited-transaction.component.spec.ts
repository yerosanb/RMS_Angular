import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditedTransactionComponent } from './view-edited-transaction.component';

describe('ViewEditedTransactionComponent', () => {
  let component: ViewEditedTransactionComponent;
  let fixture: ComponentFixture<ViewEditedTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEditedTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEditedTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
