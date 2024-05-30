import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivableAutomaticComponent } from './receivable-automatic.component';

describe('ReceivableAutomaticComponent', () => {
  let component: ReceivableAutomaticComponent;
  let fixture: ComponentFixture<ReceivableAutomaticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivableAutomaticComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivableAutomaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
