import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { AuthenticationService } from '../../../../../services/authentication/authentication.service';

const URL = 'http://localhost:3000/map';

@Component({
  selector: 'app-add-map.dialog',
  templateUrl: './add-map.dialog.html',
  styleUrls: ['./add-map.dialog.scss'],
})
export class AddMapDialogComponent implements OnInit {
  public url = URL;
  public mapName = '';
  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean;
  // test to push
  constructor(
    private dialogRef: MatDialogRef<AddMapDialogComponent>,
    private authenticationService: AuthenticationService,
  ) {
    this.uploader = new FileUploader({
      url: 'http://localhost:3000/map',
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
    };
    this.hasBaseDropZoneOver = false;
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  ngOnInit(): void {}

  public filesCatchEvents(count) {}
  close(): void {
    this.dialogRef.close();
  }
}
