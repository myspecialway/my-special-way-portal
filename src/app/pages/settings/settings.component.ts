import { Component, OnInit } from '@angular/core';
import { SubscriptionCleaner } from '../../decorators/SubscriptionCleaner.decorator';
import { SettingService } from './services/settings.service';
import { Settings } from '../../models/settings.mode';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  teachercode: number | undefined;
  _settings: Settings | undefined;

  @SubscriptionCleaner()
  subCollector;

  constructor(private settingsService: SettingService) {}
  ngOnInit(): void {
    this.subCollector.add(
      this.settingsService.getAll().subscribe((data) => {
        this._settings = data[0];
        this.teachercode = this._settings!.teachercode;
      }),
    );
  }
  codeChanged(code: number): void {
    const updatedSettings = { _id: this._settings!._id, teachercode: code };
    this.subCollector.add(
      this.settingsService.update(updatedSettings).then((data) => {
        this.teachercode = data[0].teachercode;
      }),
    );
  }
}
