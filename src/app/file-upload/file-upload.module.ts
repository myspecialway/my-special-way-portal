import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadStudentService } from './students-file-upload/students-file-upload.service';

@NgModule({
  imports: [CommonModule],
  declarations: [],
  providers: [FileUploadStudentService],
})
export class FileUploadModule {}
