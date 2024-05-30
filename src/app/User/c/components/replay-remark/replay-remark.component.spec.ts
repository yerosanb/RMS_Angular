import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReplayRemarkComponent } from './replay-remark.component';
// import { ReplayRemarkComponent } from '/replay-remark.component';

// import { ReplayRemarkComponent } from './replay-remark.component';

describe('ReplayRemarkComponent', () => {
  let component: ReplayRemarkComponent;
  let fixture: ComponentFixture<ReplayRemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplayRemarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReplayRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {  
    expect(component).toBeTruthy();
  });
});
