import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCourseDetailsComponent } from './training-course-details.component';

describe('TrainingCourseDetailsComponent', () => {
  let component: TrainingCourseDetailsComponent;
  let fixture: ComponentFixture<TrainingCourseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingCourseDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingCourseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
