import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightLogsComponent } from './flight-logs.component';

describe('FlightLogsComponent', () => {
  let component: FlightLogsComponent;
  let fixture: ComponentFixture<FlightLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
