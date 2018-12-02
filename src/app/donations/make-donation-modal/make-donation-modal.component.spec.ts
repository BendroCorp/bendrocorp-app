import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeDonationModalComponent } from './make-donation-modal.component';

describe('MakeDonationModalComponent', () => {
  let component: MakeDonationModalComponent;
  let fixture: ComponentFixture<MakeDonationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeDonationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeDonationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
