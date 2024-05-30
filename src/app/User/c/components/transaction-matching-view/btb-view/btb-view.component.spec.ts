import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtbViewComponent } from './btb-view.component';

describe('BtbViewComponent', () => {
  let component: BtbViewComponent;
  let fixture: ComponentFixture<BtbViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtbViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtbViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
