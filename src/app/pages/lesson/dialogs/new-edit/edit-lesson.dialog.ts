import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Lesson } from '../../../../models/lesson.model';

import { LessonService } from '../../../../services/lesson/lesson.graphql.service';
import { SubscriptionCleaner } from '../../../../decorators/SubscriptionCleaner.decorator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-lesson.dialog',
  templateUrl: './edit-lesson.dialog.html',
  styleUrls: ['./edit-lesson.dialog.scss'],
})
export class EditLessonDialogComponent implements OnInit {
  @SubscriptionCleaner()
  subCollector: Subscription;
  public updateButtonTitle = 'עדכן';
  public addButtonTitle = 'הוסף';
  public icons;
  private allTLessons: Lesson[];
  public allicons = [
    '00135',
    '00545',
    '00644',
    '00699',
    '00888',
    '01219',
    '01294',
    '01301',
    '01375',
    '01443',
    '01577',
    '01601',
    '02144',
    '02511',
    '02543',
    '02550',
    '02788',
    '03079',
    '03109',
    '03296',
    '03313',
    '03427',
    '03500',
    '03552',
    '03558',
    '03601',
    '03700',
    '03771',
    '05141',
    '30699',
    'Capoire', //
    'Holidays', //
    'Homeland', //
    'MedicineCabinet',
    'RoadSafety Copy',
    'RoadSafety', //
    'SumUpDay', //
    'Typing', //
    'afternoon gathering', //
    'breakfast', //
    'ceremony', //
    'commuicatios', //
    'emotional therapy', //
    'end of day preparation', //
    'farm', //
    'free play time', //
    'general', //
    'going out together', //
    'integration', //
    'large playground',
    'morning lunch break', //
    'motor skills', //
    'movement', //
    'musical english', //
    'performance', //
    'pool', //
    'science', //
    'secretary',
    'sport', //
    'trip', //
  ];
  form: FormGroup;
  public get isDuplicate(): boolean {
    if (this.allTLessons && this.allTLessons.find((lesson) => lesson.title === this.data.title)) {
      return true;
    }
    return false;
  }
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditLessonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Lesson,
    private lessonService: LessonService,
  ) {}
  public onNoClick(): void {
    this.dialogRef.close();
  }
  public onIconClick(selectedIcon: string): void {
    this.data.icon = selectedIcon;
  }

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: '',
      icon: '',
    });
    this.subCollector.add(
      this.lessonService.getAllLessons().subscribe((lessons: Lesson[]) => {
        this.allTLessons = lessons.filter((lesson) => lesson._id !== this.data._id);
        const usedIcons = lessons.map((lesson) => lesson.icon);
        this.icons = this.allicons.filter((icon) => {
          return usedIcons.indexOf(icon) < 0;
        });
        if (!this.icons.find((icn: string) => icn === 'general')) {
          this.icons = ['general'].concat(this.icons);
        }
      }),
    );
  }
  public submitForm() {}
}
