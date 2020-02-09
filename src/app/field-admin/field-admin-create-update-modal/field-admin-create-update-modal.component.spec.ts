import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldAdminCreateUpdateModalComponent } from './field-admin-create-update-modal.component';

describe('FieldAdminCreateUpdateModalComponent', () => {
  let component: FieldAdminCreateUpdateModalComponent;
  let fixture: ComponentFixture<FieldAdminCreateUpdateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldAdminCreateUpdateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldAdminCreateUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
