import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivableUnmatchComponent } from './receivable-unmatch.component';

describe('ReceivableUnmatchComponent', () => {
  let component: ReceivableUnmatchComponent;
  let fixture: ComponentFixture<ReceivableUnmatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivableUnmatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivableUnmatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
