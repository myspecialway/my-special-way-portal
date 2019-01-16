import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import BlockedSection from '../../../../../models/blocked-section.model';
import { Location } from '../../../../../models/location.model';

export interface AddUpdateBlockedSection extends BlockedSection {
  isNewBlock: boolean;
  availablePositions?: Location[];
  getPositionByLocationId?: (positions: Location[], locationId: string) => Location;
}

@Component({
  selector: 'app-add-update-block.dialog',
  templateUrl: './add-update-block.dialog.html',
  styleUrls: ['./add-update-block.dialog.scss'],
})
export class AddUpdateBlockDialogComponent implements OnInit {
  form: FormGroup;
  formControl = new FormControl('', [Validators.required]);
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddUpdateBlockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddUpdateBlockedSection,
  ) {}

  ngOnInit(): void {
    if (this.data.isNewBlock) {
      this.form = this.formBuilder.group({
        from: '',
        to: '',
        reason: '',
      });
    } else {
      if (this.data.availablePositions && this.data.getPositionByLocationId) {
        this.data.from = this.data.getPositionByLocationId(this.data.availablePositions, this.data.from).location_id;
        this.data.to = this.data.getPositionByLocationId(this.data.availablePositions, this.data.to).location_id;
      }
      this.form = this.formBuilder.group({
        from: this.data.from,
        to: this.data.to,
        reason: this.data.reason,
        _id: this.data._id,
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  confirmAdd(dialogData): void {
    this.dialogRef.close(dialogData);
  }
}
