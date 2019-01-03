import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/filter';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {}

  ngOnInit() {
    this.loadIcons();
  }

  isSupportedBrowser() {
    const isSupportedBrowser =
      /Chrome/.test(navigator.userAgent) ||
      (/Firefox/.test(navigator.userAgent) && /!Mobile/.test(navigator.userAgent));
    return isSupportedBrowser;
  }

  async loadIcons() {
    this.matIconRegistry.addSvgIcon(
      `male_face`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icon/male.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      `female_face`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icon/female.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      `male_face_enabled`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icon/male_enabled.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      `female_face_enabled`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icon/female_enabled.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      `male_face_disabled`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icon/male_disabled.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      `female_face_disabled`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icon/female_disabled.svg'),
    );
  }
}
