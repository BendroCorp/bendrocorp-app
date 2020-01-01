import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemMapListViewComponent } from './system-map-list-view.component';

describe('SystemMapListViewComponent', () => {
  let component: SystemMapListViewComponent;
  let fixture: ComponentFixture<SystemMapListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemMapListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemMapListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
