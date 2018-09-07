import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateOffenderReportModalComponent } from './create-update-offender-report-modal.component';

describe('CreateUpdateOffenderReportModalComponent', () => {
  let component: CreateUpdateOffenderReportModalComponent;
  let fixture: ComponentFixture<CreateUpdateOffenderReportModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdateOffenderReportModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateOffenderReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
