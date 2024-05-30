import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisposedAmountsComponent } from './disposed-amounts.component';

describe('DisposedAmountsComponent', () => {
  let component: DisposedAmountsComponent;
  let fixture: ComponentFixture<DisposedAmountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisposedAmountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisposedAmountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
