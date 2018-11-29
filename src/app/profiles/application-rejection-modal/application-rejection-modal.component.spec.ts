import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationRejectionModalComponent } from './application-rejection-modal.component';

describe('ApplicationRejectionModalComponent', () => {
  let component: ApplicationRejectionModalComponent;
  let fixture: ComponentFixture<ApplicationRejectionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationRejectionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationRejectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
