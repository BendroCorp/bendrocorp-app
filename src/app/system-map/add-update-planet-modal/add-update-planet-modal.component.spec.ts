import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdatePlanetModalComponent } from './add-update-planet-modal.component';

describe('AddUpdatePlanetModalComponent', () => {
  let component: AddUpdatePlanetModalComponent;
  let fixture: ComponentFixture<AddUpdatePlanetModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdatePlanetModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdatePlanetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
