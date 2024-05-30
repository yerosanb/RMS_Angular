import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAccountRequestComponent } from './view-account-request.component';

describe('ViewAccountRequestComponent', () => {
  let component: ViewAccountRequestComponent;
  let fixture: ComponentFixture<ViewAccountRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAccountRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAccountRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
