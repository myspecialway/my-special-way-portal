import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { UserService } from './services/user.graphql.service';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { User, UserType } from '../../models/user.model';
import { AddUserDialogComponent } from './dialogs/add/add-user.dialog';
import { DeleteUserDialogComponent } from './dialogs/delete/delete-user.dialog';
import * as _ from 'lodash';
import { UpdateUserDialogComponent } from './dialogs/update/update-user.dialog';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, AfterViewInit {

  displayedColumns = ['name', 'username', 'class', 'type', 'enterPersonalArea', 'editDetails', 'deleteUser'];
  dataSource = new MatTableDataSource();
  resultsLength = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') table: ElementRef;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
            return this.userService.getAllUsers();
        }),
        map((data: any) => {
          return data.data.users;
        }),
        catchError((err) => {
          console.log(err);
          return observableOf([]);
        }),
    ).subscribe((data) => {
      this.dataSource.data = [...data];
    });

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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

  editUser(user: User) {
    this.userService.update(user);
  }

  addNewUser() {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      data: { user: User },
      height: '600px',
      width: '350px',
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        const newUser: User = this._createNewUser(data);
        this.userService.create(newUser)
          .then(() => {
            this.dataSource.data.push(newUser);
            this.dataSource.paginator = this.paginator;
          });
      }
    });
  }
  deleteUser(_id: number, firstName: string, lastName: string, userType: UserType) {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      data: {_id, firstName, lastName, userType},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.userService.delete(_id)
          .then(() => {
            const index = _.findIndex(this.dataSource.data, (user) => user._id === _id);
            this.dataSource.data.splice(index, 1);
            this.dataSource.paginator = this.paginator;
          });
      }
    });
  }
  updateUser(_id: number, firstname: string, lastname: string, email: string, username: string) {
    const dialogRef = this.dialog.open(UpdateUserDialogComponent, {
      data: {_id, firstname, lastname, email, username },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const relevantUser = _.find(this.dataSource.data, {_id});
        const tempUser = _.assign({}, relevantUser, result);

        this.userService.update(tempUser)
          .then((data) => {
            const index = _.findIndex(this.dataSource.data, (user) => user._id === _id);
            this.dataSource.data[index] = _.assign({}, relevantUser, result);
            this.dataSource.paginator = this.paginator;
          });
      }
    });
  }

  _createNewUser(userData: any): User {
    const user: User = new User();
    user.firstname = userData.firstName;
    user.lastname = userData.lastName;
    user.username = userData.userName;
    user.email = userData.email;
    user.role = userData.userType;
    // user.Class = userData.Class;
    return user;
  }
}
