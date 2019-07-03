import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LawLibraryDetailsComponent } from './law-library-details.component';

describe('LawLibraryDetailsComponent', () => {
  let component: LawLibraryDetailsComponent;
  let fixture: ComponentFixture<LawLibraryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LawLibraryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LawLibraryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
