import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteLogDetailsModalComponent } from './site-log-details-modal.component';

describe('SiteLogDetailsModalComponent', () => {
  let component: SiteLogDetailsModalComponent;
  let fixture: ComponentFixture<SiteLogDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteLogDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteLogDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
