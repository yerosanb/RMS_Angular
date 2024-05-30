import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetDivisionComponent } from './fixed-asset-division.component';

describe('FixedAssetDivisionComponent', () => {
  let component: FixedAssetDivisionComponent;
  let fixture: ComponentFixture<FixedAssetDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixedAssetDivisionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedAssetDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
