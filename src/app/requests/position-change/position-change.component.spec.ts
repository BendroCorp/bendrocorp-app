import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionChangeComponent } from './position-change.component';

describe('PositionChangeComponent', () => {
  let component: PositionChangeComponent;
  let fixture: ComponentFixture<PositionChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
