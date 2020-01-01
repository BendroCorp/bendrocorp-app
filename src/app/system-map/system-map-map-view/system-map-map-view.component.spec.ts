import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemMapMapViewComponent } from './system-map-map-view.component';

describe('SystemMapMapViewComponent', () => {
  let component: SystemMapMapViewComponent;
  let fixture: ComponentFixture<SystemMapMapViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemMapMapViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemMapMapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
