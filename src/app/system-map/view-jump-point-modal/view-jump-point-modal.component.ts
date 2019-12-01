import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JumpPoint } from 'src/app/models/system-map-models';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'view-jump-point-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" *ngIf="jumpPoint">Jump Point - {{jumpPoint.title}}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body" *ngIf="jumpPoint">
      <h4>{{jumpPoint.title}}</h4>
      <p>{{jumpPoint.description}}</p>
      <p><strong>Connection Size: </strong>{{jumpPoint.connection_size.title}}</p>
      <p><strong>Connection Status: </strong>{{jumpPoint.connection_status.title}}</p>
      <div class="row">
        <div *ngIf="jumpPoint.system_one" class="col-md-6 col-sm-6">
          <h6>{{jumpPoint.system_one.title}}</h6>
          <div *ngIf="jumpPoint.primary_image_one">
            <image-view-modal [title]="jumpPoint.primary_image_one.title" [description]="jumpPoint.primary_image_one.description"
            [thumbnailUri]="jumpPoint.primary_image_one.image_url_thumbnail" [imageUri]="jumpPoint.primary_image_one.image_url"
            [createdBy]="jumpPoint.primary_image_one.created_by.main_character"></image-view-modal>
          </div>
        </div>
        <div *ngIf="jumpPoint.system_two" class="col-md-6 col-sm-6">
          <h6>{{jumpPoint.system_two.title}}</h6>
          <div *ngIf="jumpPoint.system_two.primary_image">
            <image-view-modal [title]="jumpPoint.primary_image_two.title" [description]="jumpPoint.primary_image_two.description"
            [thumbnailUri]="jumpPoint.primary_image_two.image_url_thumbnail" [imageUri]="jumpPoint.primary_image_two.image_url"
            [createdBy]="jumpPoint.primary_image_two.created_by.main_character"></image-view-modal>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <add-update-jump-point-modal [smallBtn]="false" [jumpPoint]="jumpPoint"></add-update-jump-point-modal>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})
export class ViewJumpPointModalContent {
  @Input() jumpPoint: JumpPoint;
  isEditor: boolean = (this.authService.hasClaim(22) || this.authService.hasClaim(23)) ? true : false;

  constructor(public activeModal: NgbActiveModal, private authService: AuthService) {}
}

@Component({
  selector: 'app-view-jump-point-modal',
  templateUrl: './view-jump-point-modal.component.html',
  styleUrls: ['./view-jump-point-modal.component.css']
})
export class ViewJumpPointModal implements OnInit {

  constructor(private modalService: NgbModal) { }

  public open(jumpPoint: JumpPoint) {
    const modalRef = this.modalService.open(ViewJumpPointModalContent);
    modalRef.componentInstance.jumpPoint = jumpPoint;
  }

  ngOnInit() {
  }

}
