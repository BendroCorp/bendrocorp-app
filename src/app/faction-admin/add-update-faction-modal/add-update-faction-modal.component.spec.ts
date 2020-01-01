import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateFactionModalComponent } from './add-update-faction-modal.component';

describe('AddUpdateFactionModalComponent', () => {
  let component: AddUpdateFactionModalComponent;
  let fixture: ComponentFixture<AddUpdateFactionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateFactionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateFactionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
