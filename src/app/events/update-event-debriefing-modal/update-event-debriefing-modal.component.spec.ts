import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEventDebriefingModalComponent } from './update-event-debriefing-modal.component';

describe('UpdateEventDebriefingModalComponent', () => {
  let component: UpdateEventDebriefingModalComponent;
  let fixture: ComponentFixture<UpdateEventDebriefingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateEventDebriefingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEventDebriefingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
