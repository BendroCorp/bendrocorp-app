import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemLawModalComponent } from './system-law-modal.component';

describe('SystemLawModalComponent', () => {
  let component: SystemLawModalComponent;
  let fixture: ComponentFixture<SystemLawModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemLawModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemLawModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
