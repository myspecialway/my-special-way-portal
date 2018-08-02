import {Component, OnInit, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ClassService } from './services/class.graphql.service';
import { AddClassDialogComponent } from './dialogs/add/add-class.dialog';
import { Class } from '../../models/class.model';
import { DeleteClassDialogComponent } from './dialogs/delete/delete-class.dialog';
import * as _ from 'lodash';
import { UpdateClassDialogComponent } from './dialogs/update/update-class.dialog';

@Component({
  selector: 'app-grade',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss'],
})
export class ClassComponent implements OnInit, AfterViewInit {

  displayedColumns = ['classname', 'level', 'editDetails', 'deleteClass'];
  dataSource = new MatTableDataSource<Class>();
  resultsLength = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') table: ElementRef;

  constructor(
    private classService: ClassService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
            return this.classService.getAllClasses();
        }),
        map((data: any) => {
          return data.data.classes;
        }),
        catchError((err: TypeError) => {
          console.warn('class.component::ngInInit:: empty stream recieved');
          return observableOf([]);
        }),
    ).subscribe((data) => {
      if (data) {
        this.dataSource.data = [...data];
      }
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

  addNewClass() {
    const dialogRef = this.dialog.open(AddClassDialogComponent, {
      data: { class: Class },
      height: '310px',
      width: '320px',
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        const newClass: Class = this._createNewClass(data);
        this.classService.create(newClass)
          .then(() => {
            this.dataSource.data.push(newClass);
            this.dataSource.paginator = this.paginator;
          });
      }
    });
  }
  deleteClass(_id: string, name: string, level: string) {
    const dialogRef = this.dialog.open(DeleteClassDialogComponent, {
      data: {_id, name, level},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.classService.delete(_id)
          .then(() => {
            const index = _.findIndex(this.dataSource.data, (user) =>  user._id === _id);
            this.dataSource.data.splice(index, 1);
            this.dataSource.paginator = this.paginator;
          });
      }
    });
  }
  editClass(_id: string, name: string, level: string) {
    const dialogRef = this.dialog.open(UpdateClassDialogComponent, {
      data: {_id, name, level},
      height: '310px',
      width: '320px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const relevantClass = _.find(this.dataSource.data, {_id});
        const tempClass = _.assign({}, relevantClass, result);

        this.classService.update(tempClass)
          .then((data) => {
            const index = _.findIndex(this.dataSource.data, (user) => user._id === _id);
            this.dataSource.data[index] = _.assign({}, relevantClass, result);
            this.dataSource.paginator = this.paginator;
          });
      }
    });
  }
  _createNewClass(classData: any): Class {
    const _class: Class = new Class();
    _class.name = classData.name;
    _class.level = classData.level;
    _class.number = 1;
    return _class;
  }
}
