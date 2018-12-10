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
    '00026',
    '00036',
    '00040',
    '00047',
    '00067',
    '00135',
    '00319',
    '00336',
    '00468',
    '00524',
    '00545',
    '00596',
    '00602',
    '00644',
    '00699',
    '00888',
    '00970',
    '01166',
    '01212',
    '01219',
    '01294',
    '01301',
    '01305',
    '01307',
    '01320',
    '01340',
    '01375',
    '01424',
    '01443',
    '01474',
    '01476',
    '01577',
    '01601',
    '01809',
    '01891',
    '01897',
    '01901',
    '01967',
    '01987',
    '01998',
    '02007',
    '02115',
    '02142',
    '02144',
    '02170',
    '02244',
    '02306',
    '02311',
    '02468',
    '02511',
    '02543',
    '02550',
    '02788',
    '02815',
    '02979',
    '03109',
    '03147',
    '03149',
    '03206',
    '03296',
    '03313',
    '03427',
    '03490',
    '03500',
    '03540',
    '03552',
    '03558',
    '03601',
    '03636',
    '03700',
    '03771',
    '05141',
    '05513',
    '05517',
    '05538',
    '05549',
    '13561',
    '13562',
    '30699',
    '55056',
    '55090',
    '55094',
    '55116',
    '55130',
    '55135',
    '55147',
    '55242',
    '55262',
    '55278',
    '55279',
    '55325',
    '55354',
    '55384',
    '55408',
    '55462',
    '55487',
    '55590',
    '55592',
    '55594',
    '55623',
    '55655',
    '55659',
    '55714',
    '55780',
    '55784',
    '55851',
    '55899',
    '56201',
    '56347',
    '56381',
    '58225',
    '58226',
    '58819',
    '58828',
    '58866',
    '58957',
    'Capoire',
    'GoodMorning',
    'Holidays',
    'Homeland',
    'MedicineCabinet',
    'RoadSafety Copy',
    'RoadSafety',
    'Snoozeland',
    'SumUpDay',
    'Typing',
    'afternoon gathering',
    'agriculture garden',
    'breakfast',
    'ceremony',
    'class-Alon',
    'class-Brosh',
    'class-Dekel',
    'class-Ficus',
    'class-Hadar',
    'class-Narkis',
    'class-Nitsan',
    'class-Petel',
    'class-Sahlav',
    'class-Shaked',
    'class-Tamar',
    'class-Te-enna',
    'commuicatios',
    'counselor',
    'drinking fountain gym',
    'emotional therapy',
    'end of day preparation',
    'farm',
    'free play time',
    'going out together',
    'greenhouse',
    'gymboree',
    'integration',
    'large playground',
    'learning playground',
    'morning lunch break',
    'motor skills',
    'movement',
    'musical english',
    'new playgroud',
    'performance',
    'pool',
    'science',
    'secretary',
    'sport',
    'teachers lounge',
    'toilet floor 0',
    'toilet floor 1',
    'toilet floor 2',
    'trip',
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
      }),
    );
  }
  public submitForm() {}
}
