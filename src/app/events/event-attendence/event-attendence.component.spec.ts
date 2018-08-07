import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAttendenceComponent } from './event-attendence.component';

describe('EventAttendenceComponent', () => {
  let component: EventAttendenceComponent;
  let fixture: ComponentFixture<EventAttendenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventAttendenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAttendenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
