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
    ).subscribe((data) => this.dataSource.data = data);

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
  // addNewUser() {
  //   const dialogRef = this.dialog.open(AddUserDialogComponent, {
  //     data: { user: User }, height: '600px',
  //     width: '350px',
  //   });
  //   dialogRef.afterClosed().subscribe((data) => {
  //     if (data) {
  //       // After dialog is closed we're doing frontend updates
  //       // For add we're just pushing a new row inside DataService
  //       this.dataSource.data.push(data);
  //       this.dataSource.paginator = this.paginator;

  //     }
  //   });
  // }
}
