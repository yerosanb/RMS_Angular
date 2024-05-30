import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasCoreReversalMatchedComponent } from './pas-core-reversal-matched.component';

describe('PasCoreReversalMatchedComponent', () => {
  let component: PasCoreReversalMatchedComponent;
  let fixture: ComponentFixture<PasCoreReversalMatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasCoreReversalMatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasCoreReversalMatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
