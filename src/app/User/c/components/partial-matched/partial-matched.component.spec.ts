import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialMatchedComponent } from './partial-matched.component';

describe('PartialMatchedComponent', () => {
  let component: PartialMatchedComponent;
  let fixture: ComponentFixture<PartialMatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartialMatchedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartialMatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
