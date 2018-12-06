import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingItemCreateUpdateModalComponent } from './training-item-create-update-modal.component';

describe('TrainingItemCreateUpdateModalComponent', () => {
  let component: TrainingItemCreateUpdateModalComponent;
  let fixture: ComponentFixture<TrainingItemCreateUpdateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingItemCreateUpdateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingItemCreateUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
