import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterActorComponent } from './register-actor.component';

describe('RegisterActorComponent', () => {
  let component: RegisterActorComponent;
  let fixture: ComponentFixture<RegisterActorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterActorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterActorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
