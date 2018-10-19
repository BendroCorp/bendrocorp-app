import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateMoonModalComponent } from './add-update-moon-modal.component';

describe('AddUpdateMoonModalComponent', () => {
  let component: AddUpdateMoonModalComponent;
  let fixture: ComponentFixture<AddUpdateMoonModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateMoonModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateMoonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
