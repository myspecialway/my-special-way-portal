import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  displayedColumns = ['name', 'class', 'username', 'type', 'email', 'recoverpassword', 'deleteUser'];
  dataSource = new MatTableDataSource<User>();
  resultsLength = 0;
  showNameFilter = false;
  showClassFilter = false;
  showNoRecords = false;
  nameFilter = new FormControl('');
  classFilter = new FormControl('');
  filterValues = {
    name: '',
    class: '',
  };

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild('table')
  table: ElementRef;
  @ViewChild('nameField')
  nameField: ElementRef;
  @ViewChild('classField')
  classField: ElementRef;

  @SubscriptionCleaner()
  subCollector;

  constructor(
    private ref: ChangeDetectorRef,
    private userService: UserService,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.tableFilter();

    this.subCollector.add(
      this.userService.getAllUsers().subscribe((data) => {
        this.dataSource.data = data;
        this.dataSource.data = this.dataSource.data.filter((user) => {
          return UserType[user.role] === UserType.TEACHER || UserType[user.role] === UserType.PRINCIPLE;
        });
        this.dealNoDataCase();
      }),
    );

    this.dataSource.sortingDataAccessor = this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'name':
          return item.firstname + item.lastname;
        case 'class':
          return item.class ? item.class.name : '';
        default:
          return item[property];
      }
    };

    this.nameFilter.valueChanges.subscribe((name) => {
      this.filterValues.name = name.trim().toLowerCase();
      this.dataSource.filter = JSON.stringify(this.filterValues);
      this.dealNoDataCase();
    });

    this.classFilter.valueChanges.subscribe((_class) => {
      this.filterValues.class = _class.trim().toLowerCase();
      this.dataSource.filter = JSON.stringify(this.filterValues);
      this.dealNoDataCase();
    });
  }

  private dealNoDataCase() {
    if (this.dataSource.data.length === 0 || this.dataSource.filteredData.length === 0) {
      this.showNoRecords = true;
    } else {
      this.showNoRecords = false;
    }
  }

  tableFilter(): (data: any, filter: string) => boolean {
    const filterFunction = (data, filter): boolean => {
      const searchTerms = JSON.parse(filter);
      const _name = `${data.firstname} ${data.lastname}`.toLowerCase();
      const _class = `${(data.class && data.class.name) || ''}`.toLowerCase();
      return _name.indexOf(searchTerms.name) !== -1 && _class.indexOf(searchTerms.class) !== -1;
    };
    return filterFunction;
  }

  toggleNameFilter() {
    const isEmpty = !this.nameFilter.value.trim();
    if (isEmpty) {
      this.showNameFilter = !this.showNameFilter;
    }
    if (this.showNameFilter && isEmpty) {
      this.ref.detectChanges();
      this.nameField.nativeElement.focus();
    }
  }

  toggleClassFilter() {
    const isEmpty = !this.classFilter.value.trim();
    if (isEmpty) {
      this.showClassFilter = !this.showClassFilter;
    }
    if (this.showClassFilter && isEmpty) {
      this.ref.detectChanges();
      this.classField.nativeElement.focus();
    }
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
    let dialogRef = this.dialog.open(RestorePasswordDialogComponent, config);
    if (!restore) {
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
