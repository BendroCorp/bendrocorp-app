import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationInterviewComponent } from './application-interview.component';

describe('ApplicationInterviewComponent', () => {
  let component: ApplicationInterviewComponent;
  let fixture: ComponentFixture<ApplicationInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
