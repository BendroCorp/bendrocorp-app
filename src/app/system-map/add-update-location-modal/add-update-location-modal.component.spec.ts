import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateLocationModalComponent } from './add-update-location-modal.component';

describe('AddUpdateLocationModalComponent', () => {
  let component: AddUpdateLocationModalComponent;
  let fixture: ComponentFixture<AddUpdateLocationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateLocationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateLocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
