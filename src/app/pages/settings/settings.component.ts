import { Component, OnInit } from '@angular/core';
import { SubscriptionCleaner } from '../../decorators/SubscriptionCleaner.decorator';
import { SettingService } from './services/settings.service';
import { Settings } from '../../models/settings.mode';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  teachercode: number;
  _settings: Settings | undefined;
  formControl: FormControl;
  form: FormGroup;
  teacherCodeFormControl: FormControl;

  formattedMessage: string;
  @SubscriptionCleaner()
  subCollector;

  constructor(private formBuilder: FormBuilder, private settingsService: SettingService) {
    this.teachercode = 0;
  }

  ngOnInit(): void {
    this.subCollector.add(
      this.settingsService.getAll().subscribe((data) => {
        this._settings = data[0];
        if (this._settings !== undefined) {
          this.teachercode = this._settings.teachercode;
        }
      }),
    );
    this.createForm();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      teachercodecontrol: [
        null,
        [Validators.required, Validators.pattern('^[1-9]+$'), Validators.minLength(4), Validators.maxLength(4)],
      ],
    });
  }

  codeChanged(code: number): void {
    if (this.form.controls['teachercodecontrol'].valid) {
      let updatedSettings: Settings = new Settings();
      if (this._settings !== undefined) {
        updatedSettings = { _id: this._settings._id, teachercode: code };
      }
      this.subCollector.add(
        this.settingsService.update(updatedSettings).then((data) => {
          if (data !== undefined && data.data !== undefined) {
            this.teachercode = data.data.updateSettings.teachercode;
          }
        }),
      );
    }
  }
}
