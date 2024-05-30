import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivableManualComponent } from './receivable-manual.component';

describe('ReceivableManualComponent', () => {
  let component: ReceivableManualComponent;
  let fixture: ComponentFixture<ReceivableManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivableManualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivableManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
