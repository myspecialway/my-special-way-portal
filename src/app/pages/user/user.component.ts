import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { UserService } from './services/user.service';
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
  dataSource = new MatTableDataSource<User>();
  resultsLength = 0;

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild('table')
  table: ElementRef;

  constructor(private userService: UserService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((data) => {
      this.dataSource.data = data;
    });
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
      height: '368px',
      width: '630px',
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        const newUser: User = this._createNewUser(data);
        this.userService.create(newUser);
      }
    });
  }
  deleteUser(_id: number, firstName: string, lastName: string, userType: UserType) {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      data: { _id, firstName, lastName, userType },
      height: '275px',
      width: '360px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.userService.delete(_id);
      }
    });
  }
  updateUser(_id: number, firstname: string, lastname: string, email: string, username: string, role: any, Class: any) {
    const dialogRef = this.dialog.open(UpdateUserDialogComponent, {
      data: { _id, firstname, lastname, email, username, role, Class },
      height: '376px',
      width: '631px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const relevantUser = _.find(this.dataSource.data, { _id });
        const tempUser = _.assign({}, relevantUser, result, {role: result.userType});

        this.userService.update(tempUser);
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
    user.Class = userData.Class;
    return user;
  }
}
