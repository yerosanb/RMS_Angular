import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFixedassetTransactionsComponent } from './view-fixedasset-transactions.component';

describe('ViewFixedassetTransactionsComponent', () => {
  let component: ViewFixedassetTransactionsComponent;
  let fixture: ComponentFixture<ViewFixedassetTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFixedassetTransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFixedassetTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
