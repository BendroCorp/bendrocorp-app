import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LawLibraryComponent } from './law-library.component';

describe('LawLibraryComponent', () => {
  let component: LawLibraryComponent;
  let fixture: ComponentFixture<LawLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LawLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LawLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
