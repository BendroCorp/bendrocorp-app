import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateGravityWellModalComponent } from './add-update-gravity-well-modal.component';

describe('AddUpdateGravityWellModalComponent', () => {
  let component: AddUpdateGravityWellModalComponent;
  let fixture: ComponentFixture<AddUpdateGravityWellModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateGravityWellModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateGravityWellModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
