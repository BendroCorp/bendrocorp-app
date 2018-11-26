import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Character } from '../models/character-models';


@Component({
  selector: 'image-view-modal',
  templateUrl: './image-view-modal.component.html',
  styleUrls: ['./image-view-modal.component.css']
})
export class ImageViewModalComponent implements OnInit {
  @Input() title:string
  @Input() description:string
  @Input() maxWidth:number
  @Input() imageUri:string
  @Input() createdBy:Character

  modal:NgbModalRef
  closeResult: string;

  constructor(private modalService: NgbModal) {}

  open(content) {
    this.modal = this.modalService.open(content, {ariaLabelledBy: 'Image Viewer', size: 'lg'})
  }

  close()
  {
    if (this.modal) {
      this.modal.close()
    }
  }

  ngOnInit() {
    if (!this.maxWidth) {
      this.maxWidth = 200
    }

    console.log(this.imageUri)
    
  }

}
