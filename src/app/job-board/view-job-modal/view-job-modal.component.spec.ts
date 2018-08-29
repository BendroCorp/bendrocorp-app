import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewJobModalComponent } from './view-job-modal.component';

describe('ViewJobModalComponent', () => {
  let component: ViewJobModalComponent;
  let fixture: ComponentFixture<ViewJobModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewJobModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewJobModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
