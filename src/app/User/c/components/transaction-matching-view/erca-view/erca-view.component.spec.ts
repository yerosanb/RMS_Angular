import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErcaViewComponent } from './erca-view.component';

describe('ErcaViewComponent', () => {
  let component: ErcaViewComponent;
  let fixture: ComponentFixture<ErcaViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErcaViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErcaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
