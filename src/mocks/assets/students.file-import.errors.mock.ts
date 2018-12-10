import { StudentError } from '../../app/file-import/students-file-import/students-file-import.service';

export const studentsInvalidCsvParseResultTestData = {
  data: [
    ['', 'כהן', 'בת', 'טיטאן', 'אלכסנדרה1', 'Aa123456'],
    ['אנדרי', '', 'בן', 'טיטאן', 'אנדרי', 'Aa123456'],
    ['אנדרי', 'לוי', 'מין לא קיים', 'טיטאן', 'אנדרי', 'Aa123456'],
    ['חיים', 'שפירא', 'בן', 'כיתה לא קיימת', 'חיים1', 'Aa123456'],
    ['מזל', 'בן-חיים', 'בת', 'טיטאן', 'קצר', 'Aa123456'],
    ['דוד', 'ויצמן', 'בן', 'טיטאן', 'דוד123', 'aaa'],
  ],
};

export const studentsFileErrors: StudentError[] = [
  { index: 0, fields: ['שם פרטי'] },
  { index: 1, fields: ['שם משפחה'] },
  { index: 2, fields: ['מין', 'שם משתמש'] },
  { index: 3, fields: ['כיתה'] },
  { index: 4, fields: ['שם משתמש'] },
  { index: 5, fields: ['סיסמא'] },
];

export const studentsInvalidCsvErrorsExpectation = {
  title: 'קובץ לא תקין',
  details: [
    'שורה 1 - שם פרטי',
    'שורה 2 - שם משפחה',
    'שורה 3 - מין, שם משתמש',
    'שורה 4 - כיתה',
    'שורה 5 - שם משתמש',
    'שורה 6 - סיסמא',
  ],
  bottomline: 'אנא תקן את הקובץ ונסה שנית.',
};
