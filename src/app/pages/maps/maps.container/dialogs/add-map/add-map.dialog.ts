import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FileUploader } from 'ng2-file-upload';

const URL = 'http://localhost:3000/api/upload';

@Component({
  selector: 'app-add-map.dialog',
  templateUrl: './add-map.dialog.html',
  styleUrls: ['./add-map.dialog.scss'],
})
export class AddMapDialogComponent {
  uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'mapPhoto' });
  mapName = '';
  fileName = 'file name';

  constructor(private dialogRef: MatDialogRef<AddMapDialogComponent>) {}

  close(): void {
    this.dialogRef.close();
  }

  fileUpload(e) {
    this.fileName = e.target.files[0].name;
  }
}
