import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemRatingPanelComponent } from './system-rating-panel.component';

describe('SystemRatingPanelComponent', () => {
  let component: SystemRatingPanelComponent;
  let fixture: ComponentFixture<SystemRatingPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemRatingPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemRatingPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
