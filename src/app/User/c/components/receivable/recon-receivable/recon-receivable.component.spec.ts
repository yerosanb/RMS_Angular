import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconReceivableComponent } from './recon-receivable.component';

describe('ReconReceivableComponent', () => {
  let component: ReconReceivableComponent;
  let fixture: ComponentFixture<ReconReceivableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconReceivableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReconReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
