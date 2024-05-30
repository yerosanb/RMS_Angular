import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpUsersComponent } from './ip-users.component';

describe('IpUsersComponent', () => {
  let component: IpUsersComponent;
  let fixture: ComponentFixture<IpUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IpUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IpUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
