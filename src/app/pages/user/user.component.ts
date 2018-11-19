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
  displayedColumns = ['name', 'class', 'username', 'type', 'email', 'recoverpassword', 'deleteUser'];
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
    dialogRef.afterClosed().subscribe((newUserData) => {
      if (newUserData) {
        this.userService.create(newUserData);
      }
    });
  }
  deleteUser(userData: User) {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      data: userData,
      height: '275px',
      width: '360px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.userService.delete(userData._id);
      }
    });
  }
  updateUser(userData: User) {
    const dialogRef = this.dialog.open(UpdateUserDialogComponent, {
      data: userData,
      height: '376px',
      width: '631px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const relevantUser = _.find(this.dataSource.data, { _id: userData._id });
        const tempUser = { ...relevantUser, ...result };

        this.userService.update(tempUser);
      }
    });
  }
}
