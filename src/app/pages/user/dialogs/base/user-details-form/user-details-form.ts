import { Component, OnInit, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User, UserType } from '../../../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { ClassService } from '../../../../class/services/class.graphql.service';
import { Class } from '../../../../../models/class.model';

export type UserTypeKey = keyof typeof UserType;

@Component({
  selector: 'app-user-details-form',
  templateUrl: './user-details-form.html',
  styleUrls: ['./user-details-form.scss'],
})
export class UserDetailsFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  roles: string[];
  userRoleEnum = UserType;
  classes: Class[];
  currentRole: UserTypeKey;
  formControl: FormControl;
  EmailFormControl: FormControl;
  selectUserType: FormControl;
  selectGrade: FormControl;
  userNameFormControl: FormControl;
  data: User;

  @Input()
  options = { data: {}, submitButtonLabel: 'הוסף' };

  @Input('data')
  set _data(value: User) {
    this.data = value;
    this.currentRole = (value.role as any) as UserTypeKey;
  }

  @Output()
  formSubmit = new EventEmitter<User>();
  @Output()
  cancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder, private classService: ClassService, public userService: UserService) {
    this.roles = Object.keys(this.userRoleEnum);
  }

  ngOnInit(): void {
    this.attachClasses();
    this.createFormControls();
    this.createForm();
  }

  onUserTypeChange(userType: UserTypeKey): void {
    this.currentRole = userType;
    if (this.userRoleEnum[userType] === this.userRoleEnum.PRINCIPLE && this.data.class) {
      this.data.class = undefined;
    }
  }
  getClassDisabled() {
    return this.userRoleEnum[this.currentRole] !== this.userRoleEnum.TEACHER;
  }

  attachClasses() {
    this.classService.getAllClasses().subscribe((classes) => {
      this.classes = [...classes];
    });
  }

  close() {
    this.cancel.emit();
  }

  submitForm() {
    this.formSubmit.emit(this.form.value);
  }

  compareClass(c1: Class, c2: Class): boolean {
    return c1 && c2 ? c1._id === c2._id : c1 === c2;
  }

  private createFormControls() {
    this.formControl = new FormControl('', [Validators.required]);
    this.EmailFormControl = new FormControl('', [Validators.required, Validators.email]);
    this.selectUserType = new FormControl(null, Validators.required);
    this.selectGrade = new FormControl({ disabled: this.getClassDisabled() }, Validators.required);
    this.userNameFormControl = new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.pattern('^[A-Za-z]+$'),
    ]);
  }

  private createForm() {
    this.form = this.formBuilder.group({
      firstname: '',
      lastname: '',
      username: this.userNameFormControl,
      email: this.EmailFormControl,
      role: this.selectUserType,
      class: this.selectGrade,
    });
  }

  ngOnDestroy() {}
}
