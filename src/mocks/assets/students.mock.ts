import Student, { Gender } from '../../app/models/student.model';
import { TimeSlot } from '../../app/models/timeslot.model';
import { IReminder } from '../../app/models/reminder.model';

export const studentsTestData: { students: Student[] } = {
  students: [
    {
      _id: 123,
      username: 'Rotem',
      password: '',
      firstname: 'John1',
      lastname: 'Worg1',
      gender: Gender.MALE,
      class: {
        name: 'אגוז',
        _id: '111',
        grade: 'ה',
        schedule: [{} as TimeSlot],
      },
      schedule: [{} as TimeSlot],
      reminders: [{} as IReminder],
    },
    {
      _id: 321,
      username: 'John321',
      password: '',
      firstname: 'John2',
      lastname: 'Worg2',
      gender: Gender.MALE,
      class: {
        name: 'אגוז',
        _id: '111',
        grade: 'ה',
        schedule: [{} as TimeSlot],
      },
      schedule: [{} as TimeSlot],
      reminders: [{} as IReminder],
    },
    {
      _id: 222,
      username: 'John222',
      password: '',
      firstname: 'John3',
      lastname: 'Worg3',
      gender: Gender.MALE,
      class: {
        name: 'אשוח',
        _id: '222',
        grade: 'א',
        schedule: [{} as TimeSlot],
      },
      schedule: [{} as TimeSlot],
      reminders: [{} as IReminder],
    },
    {
      _id: 333,
      username: 'John333',
      password: '',
      firstname: 'John4',
      lastname: 'Worg4',
      gender: Gender.MALE,
      class: {
        name: 'אשוח',
        _id: '222',
        grade: 'א',
        schedule: [{} as TimeSlot],
      },
      schedule: [{} as TimeSlot],
      reminders: [{} as IReminder],
    },
  ],
};
