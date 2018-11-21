import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffenderDetailsComponent } from './offender-details.component';

describe('OffenderDetailsComponent', () => {
  let component: OffenderDetailsComponent;
  let fixture: ComponentFixture<OffenderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffenderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffenderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
