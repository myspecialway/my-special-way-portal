import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FileUploader } from 'ng2-file-upload';
import { AuthenticationService } from '../../../../../services/authentication/authentication.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-add-map.dialog',
  templateUrl: './add-map.dialog.html',
  styleUrls: ['./add-map.dialog.scss'],
})
export class AddMapDialogComponent {
  mapName = '';
  floorNumber = null
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

  close(): void {
    this.dialogRef.close();
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
      this.close();
    };
  }
}
