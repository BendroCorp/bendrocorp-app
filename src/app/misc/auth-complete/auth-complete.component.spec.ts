import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCompleteComponent } from './auth-complete.component';

describe('JobCreationComponent', () => {
  let component: AuthCompleteComponent;
  let fixture: ComponentFixture<AuthCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
