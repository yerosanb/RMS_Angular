import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTransactonComponent } from './view-transacton.component';

describe('ViewTransactonComponent', () => {
  let component: ViewTransactonComponent;
  let fixture: ComponentFixture<ViewTransactonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTransactonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTransactonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
