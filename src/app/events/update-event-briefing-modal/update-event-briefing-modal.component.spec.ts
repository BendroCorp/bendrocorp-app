import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEventBriefingModalComponent } from './update-event-briefing-modal.component';

describe('UpdateEventBriefingModalComponent', () => {
  let component: UpdateEventBriefingModalComponent;
  let fixture: ComponentFixture<UpdateEventBriefingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateEventBriefingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEventBriefingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
