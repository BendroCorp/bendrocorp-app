import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemMapObjectDetailComponent } from './system-map-object-detail.component';

describe('SystemMapObjectDetailComponent', () => {
  let component: SystemMapObjectDetailComponent;
  let fixture: ComponentFixture<SystemMapObjectDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemMapObjectDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemMapObjectDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
