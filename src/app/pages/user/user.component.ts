import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { UserService } from './services/user.service';
import { User, UserType } from '../../models/user.model';
import { AddUserDialogComponent } from './dialogs/add/add-user.dialog';
import { DeleteUserDialogComponent } from './dialogs/delete/delete-user.dialog';
import * as _ from 'lodash';
import { UpdateUserDialogComponent } from './dialogs/update/update-user.dialog';
import { SubscriptionCleaner } from '../../decorators/SubscriptionCleaner.decorator';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { RestorePasswordDialogComponent } from './dialogs/restore/success/restore.dialog';
import { RestorePasswordErrorDialogComponent } from './dialogs/restore/error/restore-error.dialog';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, AfterViewInit {
  displayedColumns = ['name', 'class', 'username', 'type', 'email', 'recoverpassword', 'deleteUser'];
  dataSource = new MatTableDataSource<User>();
  resultsLength = 0;

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild('table')
  table: ElementRef;

  @SubscriptionCleaner()
  subCollector;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.subCollector.add(
      this.userService.getAllUsers().subscribe((data) => {
        this.dataSource.data = data;
        this.dataSource.data = this.dataSource.data.filter((user) => {
          return UserType[user.role] === UserType.TEACHER || UserType[user.role] === UserType.PRINCIPLE;
        });
      }),
    );

    this.dataSource.sortingDataAccessor = (item) => item.firstname + item.lastname;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  toHebrew(type: UserType) {
    return UserType[type];
  }

  addNewUser() {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      data: { user: User },
      height: '380px',
      width: '635px',
    });
    this.subCollector.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((newUserData) => {
          if (newUserData) {
            this.userService.create(newUserData);
          }
        }),
    );
  }
  deleteUser(userData: User) {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      data: userData,
      height: '275px',
      width: '360px',
    });

    this.subCollector.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((result) => {
          if (result === true) {
            this.userService.delete(userData._id);
          }
        }),
    );
  }
  async restoreUserPassword(userData: User) {
    const restore = await this.authenticationService.restorePassword(
      userData.email,
      userData.firstname,
      userData.lastname,
    );
    const config = {
      data: userData,
      height: '275px',
      width: '360px',
    };
    let dialogRef;
    if (restore) {
      dialogRef = this.dialog.open(RestorePasswordDialogComponent, config);
    } else {
      dialogRef = this.dialog.open(RestorePasswordErrorDialogComponent, config);
    }

    this.subCollector.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe(() => {}),
    );
  }
  updateUser(userData: User) {
    const dialogRef = this.dialog.open(UpdateUserDialogComponent, {
      data: userData,
      height: '376px',
      width: '631px',
    });

    this.subCollector.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((result) => {
          if (result) {
            const relevantUser = _.find(this.dataSource.data, { _id: userData._id });
            const tempUser = { ...relevantUser, ...result };

            this.userService.update(tempUser);
          }
        }),
    );
  }
}
