import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffenderReportReportDetailsComponent } from './offender-report-report-details.component';

describe('OffenderReportReportDetailsComponent', () => {
  let component: OffenderReportReportDetailsComponent;
  let fixture: ComponentFixture<OffenderReportReportDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffenderReportReportDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffenderReportReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
