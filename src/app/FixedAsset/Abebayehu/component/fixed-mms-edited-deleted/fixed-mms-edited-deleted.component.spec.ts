import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedMmsEditedDeletedComponent } from './fixed-mms-edited-deleted.component';

describe('FixedMmsEditedDeletedComponent', () => {
  let component: FixedMmsEditedDeletedComponent;
  let fixture: ComponentFixture<FixedMmsEditedDeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixedMmsEditedDeletedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedMmsEditedDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
