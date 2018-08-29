import { Component, OnInit, Input } from '@angular/core';
import { Base64Upload } from '../../models/misc-models';
import { FlightLog, FlightLogImage } from '../../models/flight-log-models';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FlightLogService } from '../flight-log.service';
import { HttpErrorResponse } from '@angular/common/http';
import { OwnedShip } from '../../models/ship-models';
import { Router } from '@angular/router';

@Component({
  selector: 'create-update-flight-log-modal',
  templateUrl: './create-update-flight-log-modal.component.html',
  styleUrls: ['./create-update-flight-log-modal.component.css']
})
export class CreateUpdateFlightLogModalComponent implements OnInit {
  @Input() flightLog:FlightLog
  @Input() largeBtn:boolean = false
  formAction:string
  openModal:NgbModalRef
  flightLogShips:OwnedShip[] = []
  constructor(private modalService: NgbModal, private flightLogService:FlightLogService, private router:Router) { }

  open(content) {
    this.openModal = this.modalService.open(content)
  }

  deleteFlightLog()
  {
    if (this.flightLog && this.flightLog.id && this.flightLog.privacy_changes_allowed) {
      if (confirm("Are you sure you want to delete this flight log? This action is permenant and cannot be un-done.")) {
        this.flightLogService.delete(this.flightLog).subscribe(
          (result) => {
            if (!(result instanceof HttpErrorResponse)) {
              this.router.navigateByUrl('/flight-logs')
              this.openModal.close()
            }
          }
        )
      }
    }
  }

  createUpdateFlightLog()
  {
    if (this.flightLog && this.flightLog.id && this.flightLog.privacy_changes_allowed) {
      console.log(this.flightLog.id);      
      this.flightLogService.update(this.flightLog).subscribe(
        (result) => {
          if (!(result instanceof HttpErrorResponse)) {
            this.flightLogService.refreshData()
            this.openModal.close()
          }
        }
      )
    } else {
      this.flightLogService.create(this.flightLog).subscribe(
        (result) => {
          if (!(result instanceof HttpErrorResponse)) {
            this.flightLogService.refreshData()
            this.openModal.close()
          }
        }
      )
    }
  }

  pushImage()
  {
    this.flightLog.new_image_uploads.push({ } as FlightLogImage)
  }

  popImage(imageIndex:number)
  {
    if (this.flightLog && this.flightLog.new_image_uploads) {
      this.flightLog.new_image_uploads.splice(imageIndex, 1)
    }
  }

  deleteImage()
  {
    // TODO
  }

  handleImageUploadFileInput(files: FileList, flight_log_image_index:number)
  {
    console.log(files);
    // fetch file data on file to uploads    
    let file = files.item(0);    

    // add the avatar information to the user object so it can be uploaded
    this.getBase64(file).then(
      result => {
        this.flightLog.new_image_uploads[flight_log_image_index].image = { name: file.name, type: file.type, size: file.size, base64: result } as Base64Upload
      }
    );
  }

  getBase64(file) {
    // https://stackoverflow.com/questions/47936183/angular-5-file-upload
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  ngOnInit() {
    if (this.flightLog && this.flightLog.id) {
      this.formAction = "Update"
    } else {
      this.formAction = "Create"
      this.flightLog = { new_image_uploads: [] } as FlightLog
    }

    this.flightLogService.list_ships().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.flightLogShips = results
        }
      }
    )
  }

}
