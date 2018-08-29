import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateFlightLogModalComponent } from './create-update-flight-log-modal.component';

describe('CreateUpdateFlightLogModalComponent', () => {
  let component: CreateUpdateFlightLogModalComponent;
  let fixture: ComponentFixture<CreateUpdateFlightLogModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdateFlightLogModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateFlightLogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
