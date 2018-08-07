import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffenderReportsComponent } from './offender-reports.component';

describe('OffenderReportsComponent', () => {
  let component: OffenderReportsComponent;
  let fixture: ComponentFixture<OffenderReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffenderReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffenderReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
