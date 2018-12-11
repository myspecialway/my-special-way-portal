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

  async loadIcons() {
    this.matIconRegistry.addSvgIcon(
      `male_face`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icon/male.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      `female_face`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icon/female.svg'),
    );
  }
}
