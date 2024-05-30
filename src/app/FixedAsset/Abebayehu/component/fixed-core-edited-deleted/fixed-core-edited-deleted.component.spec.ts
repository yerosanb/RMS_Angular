import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedCoreEditedDeletedComponent } from './fixed-core-edited-deleted.component';

describe('FixedCoreEditedDeletedComponent', () => {
  let component: FixedCoreEditedDeletedComponent;
  let fixture: ComponentFixture<FixedCoreEditedDeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixedCoreEditedDeletedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedCoreEditedDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
