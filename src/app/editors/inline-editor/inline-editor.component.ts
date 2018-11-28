import { Component, OnInit, Output, EventEmitter, ViewChild, Input, ElementRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '../../../../node_modules/@angular/forms';

const INLINE_EDIT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InlineEditorComponent),
  multi: true
};

@Component({
  selector: 'input-editor',
  templateUrl: './inline-editor.component.html',
  styleUrls: ['./inline-editor.component.css'],
  providers: [INLINE_EDIT_CONTROL_VALUE_ACCESSOR]
})
export class InlineEditorComponent implements OnInit, ControlValueAccessor {

  // TO USE: <input-editor label="First Name" id="txtname" [(ngModel)]="name" type="text" placeholder="Enter First Name" (onSave)="sampleClick()"></input-editor>

  @ViewChild('inputEditorControl') inputEditorControl: ElementRef; // input DOM element
  @Input() label: string = '';  // Label value for input element
  @Input() placeholder: string = ''; // Placeholder value ofr input element
  @Input() type: string = 'text'; // The type of input element
  @Input() required: string = 'false'; // Is input requried?
  @Input() requiredMessage: string = '';
  @Input() disabled: string = 'false'; // Is input disabled?
  @Input() id: string = '';
  @Input() stringlength: string = '';
  @Output() onSave: EventEmitter<string> = new EventEmitter();
  @Output() onCancel: EventEmitter<string> = new EventEmitter();
  @Output() onEditing: EventEmitter<string> = new EventEmitter();

  private _originalValue:any;
  private _value: string = ''; // Private variable for input value
  private preValue: string = ''; // The value before clicking to edit
  editing: boolean = false; // Is Component in edit mode?
  public onChange: any = Function.prototype; // Trascend the onChange event
  public onTouched: any = Function.prototype; // Trascend the onTouch event
  private inputReqflag:boolean = false;

  onSaveInput() {
    if(this.required == "true"){
      if(this.inputEditorControl.nativeElement.value == null || this.inputEditorControl.nativeElement.value === undefined || this.inputEditorControl.nativeElement.value === "")   {
        this.inputReqflag = true;        
        return;
      }
      else{
        this.inputReqflag = false;
      }      
    }
    else{
      this.inputReqflag = false;
    }

    if(this._originalValue != this._value){
      this.onSave.emit('clicked save');
    }    

    this.editing=false;
  }

  onCancelInput() {
    this.editing=false;
    this._value=this._originalValue;
    this.inputReqflag = false;
    this.onCancel.emit('clicked cancel');
  }

  onCloseInput(){
    this.editing=false;
    this.inputReqflag = false;
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
    this._originalValue=value;

    setTimeout(() => { this.inputEditorControl.nativeElement.focus(); }, 300);
  }

  IsInputTextEmpty()
  {
    return (this._value === "")
  }

  constructor() { }

  ngOnInit() {
  }

}
