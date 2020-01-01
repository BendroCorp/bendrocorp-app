import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewJumpPointModalComponent } from './view-jump-point-modal.component';

describe('ViewJumpPointModalComponent', () => {
  let component: ViewJumpPointModalComponent;
  let fixture: ComponentFixture<ViewJumpPointModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewJumpPointModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewJumpPointModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
