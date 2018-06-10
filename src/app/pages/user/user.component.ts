import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { UserService } from './services/user.service';
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

  displayedColumns = ['name', 'userName', 'class', 'type', 'editDetails', 'deleteUser'];
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
          if (this.userService !== undefined) {
            return this.userService.getAllUsers();
          }
        }),
        map((data) => {
          return data.data.allUsers;
        }),
        catchError(() => {
          return observableOf([]);
        }),
    ).subscribe((data) => this.dataSource.data = [...data]);

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
        this.dataSource.data.push(data);
        this.dataSource.paginator = this.paginator;

      }
    });
  }
  deleteUser(id: number, firstName: string, lastName: string, userType: UserType) {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      data: {id: id, firstName: firstName, lastName: lastName, userType: userType}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const index = _.findIndex(this.dataSource.data, function(user) { return user.id == id })
        this.dataSource.data.splice(index,1);
        this.dataSource.paginator = this.paginator;
      }
    });
  }
  updateUser(id: number, firstName: string, lastName: string, email: string, userName: string) {
    const dialogRef = this.dialog.open(UpdateUserDialogComponent, {
      data: {firstName: firstName, lastName: lastName, email: email, userName: userName}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = _.findIndex(this.dataSource.data, function(user) { return user.id == id });
        this.dataSource.data[index] = _.assign({}, this.dataSource.data[index], result);
        this.dataSource.paginator = this.paginator;
      }
    });
  }
}
