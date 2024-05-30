import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigatorUpperComponent } from './navigator-upper.component';

describe('NavigatorUpperComponent', () => {
  let component: NavigatorUpperComponent;
  let fixture: ComponentFixture<NavigatorUpperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigatorUpperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigatorUpperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
