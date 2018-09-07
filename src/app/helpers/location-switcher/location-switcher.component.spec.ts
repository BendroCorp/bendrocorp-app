import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSwitcherComponent } from './location-switcher.component';

describe('LocationSwitcherComponent', () => {
  let component: LocationSwitcherComponent;
  let fixture: ComponentFixture<LocationSwitcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationSwitcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
