import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateSystemImageModalComponent } from './add-update-system-image-modal.component';

describe('AddUpdateSystemImageModalComponent', () => {
  let component: AddUpdateSystemImageModalComponent;
  let fixture: ComponentFixture<AddUpdateSystemImageModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateSystemImageModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateSystemImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
