import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateSystemObjectModalComponent } from './add-update-system-object-modal.component';

describe('AddUpdateSystemObjectModalComponent', () => {
  let component: AddUpdateSystemObjectModalComponent;
  let fixture: ComponentFixture<AddUpdateSystemObjectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateSystemObjectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateSystemObjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
