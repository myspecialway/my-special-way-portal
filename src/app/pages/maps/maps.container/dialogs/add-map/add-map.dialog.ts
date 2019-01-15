import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FileUploader } from 'ng2-file-upload';
import { AuthenticationService } from '../../../../../services/authentication/authentication.service';
import { environment } from '../../../../../../environments/environment';
import { IFileEvent, FloorEventType } from '../../../../../models/maps.file.model';

@Component({
  selector: 'app-add-map.dialog',
  templateUrl: './add-map.dialog.html',
  styleUrls: ['./add-map.dialog.scss'],
})
export class AddMapDialogComponent {
  mapName = '';
  floorNumber = null;
  isSending = false;
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;

  constructor(
    private dialogRef: MatDialogRef<AddMapDialogComponent>,
    private authenticationService: AuthenticationService,
  ) {
    this.initUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  onChangeFile(event: any): void {
    event.srcElement.value = '';
  }

  removeFile(event) {
    event.stopPropagation();
    this.uploader.clearQueue();
  }

  sendFile() {
    this.isSending = true;
    this.uploader.uploadAll();
  }

  close(item: IFileEvent): void {
    this.dialogRef.close(item);
  }

  private initUploader() {
    this.uploader = new FileUploader({
      queueLimit: 1,
      url: environment.hotConfig.MSW_HOT_UPLOAD_MAP,
      itemAlias: 'mapFilename',
      headers: [
        { name: 'authorization', value: ('Bearer ' + this.authenticationService.getTokenFromLocalStore()) as string },
      ],
    });

    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      console.log('ImageUpload:onBeforeUploadItem:', item);
      this.uploader.options.additionalParameter = {
        mapName: this.mapName,
        floor: this.floorNumber,
      };
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:onCompleteItem:', item, status, response);
      if (status === 201) {
        const res = JSON.parse(response);
        this.close({
          payload: { id: res.id },
          type: FloorEventType.UPLOAD,
        } as IFileEvent);
      } else {
        this.close({
          type: FloorEventType.UPLOAD,
        } as IFileEvent);
      }
    };
  }
}
