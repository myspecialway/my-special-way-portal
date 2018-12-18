import { NonActiveTime } from '../../app/models/non-active-time.model';

export const nonActiveTimeTestData: { nonActiveTimes: NonActiveTime[] } = {
  nonActiveTimes: [
    {
      _id: '4c20fb1fa4098f781af32e11',
      title: 'אירוע 1',
      isAllDayEvent: true,
      startDateTime: 'Tue, 11 Dec 2018 00:00:00 GMT',
      endDateTime: 'Tue, 11 Dec 2018 00:00:00 GMT',
      isAllClassesEvent: true,
      classes: [{ _id: '5b10fb1ff8022f6011f30f48', name: 'טיטאן' }, { _id: '5b10fb1fb4eb0c7fda30f70a', name: 'פטל' }],
    },
    {
      _id: '5c0fa61642d6052794ab44c8',
      title: 'אירוע 2',
      isAllDayEvent: false,
      startDateTime: 'Mon, 10 Dec 2018 14:23:09 GMT',
      endDateTime: 'Tue, 11 Dec 2018 16:23:09 GMT',
      isAllClassesEvent: false,
      classes: [
        {
          _id: '5c04f3814408e8334404ef16',
          name: 'טיטאן',
        },
        {
          _id: '5c04f3814408e8334404ef17',
          name: 'פטל',
        },
      ],
    },
    {
      _id: '5c0fbbb04e773c17106afdb0',
      title: 'אירוע 3',
      isAllDayEvent: true,
      startDateTime: 'Mon, 10 Dec 2018 14:23:09 GMT',
      endDateTime: 'Mon, 10 Dec 2018 16:23:09 GMT',
      isAllClassesEvent: false,
      classes: [
        {
          _id: '5c04f3814408e8334404ef17',
          name: 'פטל',
        },
      ],
    },
    {
      _id: '5c0fbbb04e773c17106afdb0',
      title: 'אירוע 4',
      isAllDayEvent: true,
      startDateTime: 'Mon, 10 Dec 2018 14:23:09 GMT',
      endDateTime: 'Mon, 10 Dec 2018 14:23:09 GMT',
      isAllClassesEvent: true,
    },
  ],
};
