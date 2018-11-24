import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateSettlementModalComponent } from './add-update-settlement-modal.component';

describe('AddUpdateSettlementModalComponent', () => {
  let component: AddUpdateSettlementModalComponent;
  let fixture: ComponentFixture<AddUpdateSettlementModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateSettlementModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateSettlementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
