import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaEditorComponent } from './textarea-editor.component';

describe('TextareaEditorComponent', () => {
  let component: TextareaEditorComponent;
  let fixture: ComponentFixture<TextareaEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextareaEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
