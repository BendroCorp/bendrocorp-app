import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiOfflineComponent } from './api-offline.component';

describe('ApiOfflineComponent', () => {
  let component: ApiOfflineComponent;
  let fixture: ComponentFixture<ApiOfflineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiOfflineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiOfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
