import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldAdminDetailsComponent } from './field-admin-details.component';

describe('FieldAdminDetailsComponent', () => {
  let component: FieldAdminDetailsComponent;
  let fixture: ComponentFixture<FieldAdminDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldAdminDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldAdminDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
