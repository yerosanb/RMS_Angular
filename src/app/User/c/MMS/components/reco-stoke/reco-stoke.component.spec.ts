import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoStokeComponent } from './reco-stoke.component';

describe('RecoStokeComponent', () => {
  let component: RecoStokeComponent;
  let fixture: ComponentFixture<RecoStokeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoStokeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoStokeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
