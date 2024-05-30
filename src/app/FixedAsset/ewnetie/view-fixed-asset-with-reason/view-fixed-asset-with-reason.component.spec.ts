import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFixedAssetWithReasonComponent } from './view-fixed-asset-with-reason.component';

describe('ViewFixedAssetWithReasonComponent', () => {
  let component: ViewFixedAssetWithReasonComponent;
  let fixture: ComponentFixture<ViewFixedAssetWithReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFixedAssetWithReasonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFixedAssetWithReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
