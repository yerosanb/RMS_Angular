import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAccountRemarkComponent } from './view-account-remark.component';

describe('ViewAccountRemarkComponent', () => {
  let component: ViewAccountRemarkComponent;
  let fixture: ComponentFixture<ViewAccountRemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAccountRemarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAccountRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
