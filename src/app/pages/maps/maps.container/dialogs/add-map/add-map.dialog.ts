import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FileUploader } from 'ng2-file-upload';
import { AuthenticationService } from '../../../../../services/authentication/authentication.service';

const URL = 'http://localhost:3000/map';

@Component({
  selector: 'app-add-map.dialog',
  templateUrl: './add-map.dialog.html',
  styleUrls: ['./add-map.dialog.scss'],
})
export class AddMapDialogComponent implements OnInit {
  mapName = '';
  fileName = '';
  isSending = false;
  fileUploaded = false;
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;

  constructor(
    private dialogRef: MatDialogRef<AddMapDialogComponent>,
    private authenticationService: AuthenticationService,
  ) {
    this.uploader = new FileUploader({
      url: URL,
      itemAlias: 'mapFilename',
      headers: [
        { name: 'authorization', value: ('Bearer ' + this.authenticationService.getTokenFromLocalStore()) as string },
      ],
    });

    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      console.log('ImageUpload:onBeforeUploadItem:', item);
      this.uploader.options.additionalParameter = {
        floor: this.mapName,
      };
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:onCompleteItem:', item, status, response);
      this.close();
    };

    this.hasBaseDropZoneOver = false;
  }

  ngOnInit(): void {}

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  filesCatchEvents(count) {}

  close(): void {
    this.dialogRef.close();
  }

  onFileChosen() {
    this.fileUploaded = true;
    this.fileName = this.uploader.queue[0].file.name;
  }

  removeFile(event) {
    event.stopPropagation();
    this.uploader.queue = [];
    this.fileUploaded = false;
  }

  sendMapFile() {
    this.isSending = true;
    this.uploader.uploadAll();
  }
}
