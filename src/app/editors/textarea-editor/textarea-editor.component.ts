import { Component, OnInit, ViewChild, ElementRef, Input, EventEmitter, Output, Renderer, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const TEXTAREA_EDIT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TextareaEditorComponent),
  multi: true
};

// <textarea-editor [(ngModel)]="myBio" 
// stringlength="700" 
// label="My Bio" 
// maxheight="200px">
// </textarea-editor>

@Component({
  selector: 'textarea-editor',
  templateUrl: './textarea-editor.component.html',
  styleUrls: ['./textarea-editor.component.css'],
  providers: [TEXTAREA_EDIT_VALUE_ACCESSOR]
})
export class TextareaEditorComponent implements OnInit, ControlValueAccessor {
  @ViewChild('textareaEditorControl') textareaEditorControl: ElementRef;
  @Input() label: string = '';
  @Input() required: string = "false";
  @Input() requiredMessage: string = '';
  @Input() disabled: string = "false";
  @Input() id: string = '';
  @Input() stringlength: string = '';
  @Input() maxheight: string = 'auto';
  @Input() minheight: string = 'auto';
  @Input() placeholder: string = '';
  @Output() onSave: EventEmitter<string> = new EventEmitter();
  @Output() onCancel: EventEmitter<string> = new EventEmitter();
  @Output() onEditing: EventEmitter<string> = new EventEmitter();

  private _originalValue: any;
  private _value: string = ''; // Private variable for input value
  private preValue: string = ''; // The value before clicking to edit
  editing: boolean = false; // Is Component in edit mode?
  public onChange: any = Function.prototype; // Trascend the onChange event
  public onTouched: any = Function.prototype; // Trascend the onTouch event
    private textareaReqflag: boolean = false;

  constructor(element: ElementRef, private _renderer: Renderer) { }

  onSaveTextarea() {
    if (this.required == "true") {
        if (this.textareaEditorControl.nativeElement.value == null || this.textareaEditorControl.nativeElement.value === undefined || this.textareaEditorControl.nativeElement.value === "") {
            this.textareaReqflag = true;
            return;
        }
        else {
            this.textareaReqflag = false;
        }
    }
    else {
        this.textareaReqflag = false;
    }

    if (this._originalValue != this._value) {
        this.onSave.emit('clicked save');
    }
    this.editing = false;
  }

  onCancelTextarea() {
    this.editing = false;
    this._value = this._originalValue;
    this.textareaReqflag = false;
    this.onCancel.emit('clicked cancel');
  }

  onCloseTextarea() {
    this.editing = false;
    this.textareaReqflag = false;
  }

  // Control Value Accessors for ngModel
  get value(): any {
    return this._value;
  }

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  // Required for ControlValueAccessor interface
  writeValue(value: any) {
    this._value = value;
  }

  // Required forControlValueAccessor interface
  public registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  // Required forControlValueAccessor interface
  public registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  // Do stuff when the input element loses focus
  onBlur($event: Event) {
    this.editing = false;
  }

  // Start the editting process for the input element
  edit(value: any) {
    if (this.disabled === "true") {
      return;
    }

    this.onEditing.emit('editing click');

    this.preValue = value;
    this.editing = true;
    this._originalValue = value;

    setTimeout(() => { this.textareaEditorControl.nativeElement.focus(); }, 300);
  }

  IsTextareaEmpty(): Boolean {
    return (this._value === undefined || this._value == '');
  }

  ngOnInit() {
  }

}
