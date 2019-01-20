import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  model: any = {};
  returnUrl: string;
  formFieldOptions: FormGroup;
  sentResponse = false;
  errorMessage = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    formBuilder: FormBuilder,
  ) {
    this.formFieldOptions = formBuilder.group({ hideRequired: true });
  }

  ngOnInit(): void {
    this.authenticationService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  async resetPassword() {
    try {
      const sentResponse = await this.authenticationService.resetPassword(this.model.email);

      if (!sentResponse) {
        console.warn('reset-password.component::reset-password:: reset-password error');
        return;
      }

      this.router.navigate(['/sent-successfully']);
    } catch (err) {
      console.error(`reset-password.component::reset-password:: error in authentication ${err}`);
      this.errorMessage = 'לא הצלחנו לשלוח אימייל לכתובת: ' + this.model.email + '. אנא נסה שוב.';
    }
  }
}
