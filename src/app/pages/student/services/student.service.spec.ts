import { StudentService } from './student.service';
import { of } from 'rxjs/observable/of';
import { throwError } from 'rxjs';

jest.mock('apollo-angular');
import { Apollo } from 'apollo-angular';
import Student, { Gender } from '../../../models/student.model';

const apollo = new Apollo();

describe('student service tests', () => {
  let service: StudentService;
  beforeEach(() => {
    service = new StudentService(apollo);
  });

  it('should normalize allStudents response', async () => {
    (apollo.watchQuery as jest.Mock).mockReturnValue({ valueChanges: of({ data: { students: [{ id: 1 }] } }) });
    expect(await service.getAllStudents().toPromise()).toEqual([{ id: 1 }]);
  });

  it('should return empty array when get students query fails', async () => {
    (apollo.watchQuery as jest.Mock).mockReturnValue({ valueChanges: throwError('') });
    expect(await service.getAllStudents().toPromise()).toEqual([]);
  });

  it('should return created user response without changes when calling create user', async () => {
    (apollo.mutate as jest.Mock).mockReturnValue(of({ data: { student: { id: 1 } } }));
    const student = { _id: 21, class: { _id: '21' } } as Student;
    expect(await service.create(student)).toEqual({ data: { student: { id: 1 } } });
  });

  it('should normalize get student by id response', async () => {
    (apollo.query as jest.Mock).mockReturnValue(of({ data: { student: { id: 1 } } }));
    expect(await service.getById('21')).toEqual({ id: 1 });
  });

  it('should normalize update student response', async () => {
    (apollo.mutate as jest.Mock).mockReturnValue(of({ data: { updateStudent: { _id: 1 } } }));
    expect(
      await service.update({
        _id: 21,
        username: 'string',
        password: 'string',
        firstname: 'string',
        lastname: 'string',
        gender: Gender.FEMALE,
        class_id: 'string',
      }),
    ).toEqual(1);
  });

  it('should normalize delete student response', async () => {
    (apollo.mutate as jest.Mock).mockReturnValue(of({ data: { deleteStudent: { _id: 1 } } }));
    expect(await service.delete(1)).toEqual({ _id: 1 });
  });
});
