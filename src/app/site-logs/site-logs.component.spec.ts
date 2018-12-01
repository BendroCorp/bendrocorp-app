import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteLogsComponent } from './site-logs.component';

describe('SiteLogsComponent', () => {
  let component: SiteLogsComponent;
  let fixture: ComponentFixture<SiteLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
