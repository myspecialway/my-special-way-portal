import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import BlockedSection from '../../../../../models/blocked-section.model';
import { Location } from '../../../../../models/location.model';
import { MSWSnackbar } from '../../../../../services/msw-snackbar/msw-snackbar.service';

export interface AddUpdateBlockedSection extends BlockedSection {
  isNewBlock: boolean;
  locationByName: Map<string, Location>;
  blockSections: BlockedSection[];
  floor: number;
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
    private mswSnackbar: MSWSnackbar,
    public dialogRef: MatDialogRef<AddUpdateBlockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddUpdateBlockedSection,
  ) {}

  ngOnInit(): void {
    if (this.data.isNewBlock) {
      this.form = this.formBuilder.group({
        from: ['', Validators.required],
        to: ['', Validators.required],
        reason: ['', Validators.required],
      });
    } else {
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

  getLocationByName(_locationByName: Map<string, Location>, locationName: string) {
    return _locationByName.get(locationName);
  }

  blockedSectionAlreadyExists = (blockedSection: BlockedSection) => {
    for (const bS of this.data.blockSections) {
      if (bS.from === blockedSection.from && bS.to === blockedSection.to) {
        return true;
      }
      return false;
    }
  };

  confirmAdd(dialogData): void {
    const fromLocation = this.getLocationByName(this.data.locationByName, dialogData.from);
    const toLocation = this.getLocationByName(this.data.locationByName, dialogData.to);
    if (!fromLocation || !toLocation) {
      this.mswSnackbar.displayTimedMessage('אחד המקטעים לא קיים');
      return;
    }
    if (dialogData.from === dialogData.to) {
      this.mswSnackbar.displayTimedMessage('לא ניתן להוסיף את אותו קטע חסום');
      return;
    }
    if (fromLocation._id === toLocation._id) {
      this.mswSnackbar.displayTimedMessage('המקטע כבר קיים');
      return;
    }

    if (!this.isPointConnectedInMap(fromLocation, toLocation)) {
      this.mswSnackbar.displayTimedMessage('לא ניתן לחסום נקודות מקומות שונות שאינם מקושרות');
      return;
    }

    dialogData.from = fromLocation._id;
    dialogData.to = toLocation._id;

    this.dialogRef.close(dialogData);
  }

  private isPointConnectedInMap(fromLocation: Location | undefined, toLocation: Location | undefined) {
    if (this.isStepFromOtherFloor(fromLocation as Location) && this.isNotStepType(toLocation as Location)) {
      return false;
    } else if (this.isStepFromOtherFloor(toLocation as Location) && this.isNotStepType(fromLocation as Location)) {
      return false;
    }
    return true;
  }

  isStepFromOtherFloor(location: Location) {
    if (location && location.type === 'מדרגות' && +location.position.floor !== +this.data.floor) {
      return true;
    }
    return false;
  }

  isNotStepType(location: Location) {
    if (location && location.type !== 'מדרגות') {
      return true;
    }
    return false;
  }
}
