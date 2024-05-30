import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtgsViewComponent } from './rtgs-view.component';

describe('RtgsViewComponent', () => {
  let component: RtgsViewComponent;
  let fixture: ComponentFixture<RtgsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RtgsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RtgsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
