import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCertificationModalComponent } from './event-certification-modal.component';

describe('EventCertificationModalComponent', () => {
  let component: EventCertificationModalComponent;
  let fixture: ComponentFixture<EventCertificationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventCertificationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCertificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
