import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCourseCreateUpdateModalComponent } from './training-course-create-update-modal.component';

describe('TrainingCourseCreateUpdateModalComponent', () => {
  let component: TrainingCourseCreateUpdateModalComponent;
  let fixture: ComponentFixture<TrainingCourseCreateUpdateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingCourseCreateUpdateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingCourseCreateUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
