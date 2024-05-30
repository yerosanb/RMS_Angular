import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarkComponent } from './remark.component';

describe('RemarkComponent', () => {
  let component: RemarkComponent;
  let fixture: ComponentFixture<RemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
