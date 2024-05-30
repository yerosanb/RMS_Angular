import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCoreReversalComponent } from './view-core-reversal.component';

describe('ViewCoreReversalComponent', () => {
  let component: ViewCoreReversalComponent;
  let fixture: ComponentFixture<ViewCoreReversalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCoreReversalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCoreReversalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
