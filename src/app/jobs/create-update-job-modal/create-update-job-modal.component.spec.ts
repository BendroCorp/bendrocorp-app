import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateJobModalComponent } from './create-update-job-modal.component';

describe('CreateUpdateJobModalComponent', () => {
  let component: CreateUpdateJobModalComponent;
  let fixture: ComponentFixture<CreateUpdateJobModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdateJobModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateJobModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
