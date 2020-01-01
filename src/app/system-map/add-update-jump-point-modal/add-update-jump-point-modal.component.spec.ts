import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateJumpPointModalComponent } from './add-update-jump-point-modal.component';

describe('AddUpdateJumpPointModalComponent', () => {
  let component: AddUpdateJumpPointModalComponent;
  let fixture: ComponentFixture<AddUpdateJumpPointModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateJumpPointModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateJumpPointModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
