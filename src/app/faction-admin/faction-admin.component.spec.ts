import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactionAdminComponent } from './faction-admin.component';

describe('FactionAdminComponent', () => {
  let component: FactionAdminComponent;
  let fixture: ComponentFixture<FactionAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactionAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
