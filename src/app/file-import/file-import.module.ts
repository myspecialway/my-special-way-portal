import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileImportStudentService } from './students-file-import/students-file-import.service';

@NgModule({
  imports: [CommonModule],
  declarations: [],
  providers: [FileImportStudentService],
})
export class FileImportModule {}
