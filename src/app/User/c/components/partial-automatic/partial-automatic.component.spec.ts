import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialAutomaticComponent } from './partial-automatic.component';

describe('PartialAutomaticComponent', () => {
  let component: PartialAutomaticComponent;
  let fixture: ComponentFixture<PartialAutomaticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartialAutomaticComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartialAutomaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
