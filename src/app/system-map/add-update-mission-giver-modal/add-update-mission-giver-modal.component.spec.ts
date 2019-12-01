import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateMissionGiverModalComponent } from './add-update-mission-giver-modal.component';

describe('AddUpdateMissionGiverModalComponent', () => {
  let component: AddUpdateMissionGiverModalComponent;
  let fixture: ComponentFixture<AddUpdateMissionGiverModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateMissionGiverModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateMissionGiverModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
