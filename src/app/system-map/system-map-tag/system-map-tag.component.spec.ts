import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemMapTagComponent } from './system-map-tag.component';

describe('SystemMapTagComponent', () => {
  let component: SystemMapTagComponent;
  let fixture: ComponentFixture<SystemMapTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemMapTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemMapTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
