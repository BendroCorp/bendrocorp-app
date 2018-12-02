import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateDonationModalComponent } from './create-update-donation-modal.component';

describe('CreateUpdateDonationModalComponent', () => {
  let component: CreateUpdateDonationModalComponent;
  let fixture: ComponentFixture<CreateUpdateDonationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdateDonationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateDonationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
