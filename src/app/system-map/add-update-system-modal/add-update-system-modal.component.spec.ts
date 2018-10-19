import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateSystemModalComponent } from './add-update-system-modal.component';

describe('AddUpdateSystemModalComponent', () => {
  let component: AddUpdateSystemModalComponent;
  let fixture: ComponentFixture<AddUpdateSystemModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateSystemModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateSystemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
