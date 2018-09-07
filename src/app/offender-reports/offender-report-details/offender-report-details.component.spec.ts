import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffenderReportDetailsComponent } from './offender-report-details.component';

describe('OffenderReportDetailsComponent', () => {
  let component: OffenderReportDetailsComponent;
  let fixture: ComponentFixture<OffenderReportDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffenderReportDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffenderReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
