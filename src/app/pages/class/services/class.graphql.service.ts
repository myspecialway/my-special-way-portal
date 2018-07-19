import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Class, ClassQuery, InputClass } from '../../../models/class.model';

@Injectable()
export class ClassService {

  classes: Observable<Class[]>;

  constructor(private apollo: Apollo) { }

  updateClass = gql`
    mutation updateClass($id: ID!, $class: InputClass!) {
      updateClass(id: $id, class: $class) {
        _id
        name
        level
        number
        schedule {
          index
          lesson {
            _id
            title
            icon
          }
        }
      }
    }
  `;

  getAllClasses() {
    return this.apollo.query<ClassQuery>({
      query: gql`{
        classes {
          _id
          level
          name
        }
      }` }).toPromise();
  }
  classById(id: string) {
    return this.apollo.query<ClassQuery>({
      query: gql`{
        classById(id: "${id}") {
          _id
          name
          level
          number
          schedule {
            index
            lesson {
              _id
              title
              icon
            }
          }
        }
      }`,
    }).toPromise();
  }
  classByName(name: string) {
    return this.apollo.query<ClassQuery>({
      query: gql`{
        classByName(name: "${name}") {
          _id
          name
          level
          number
          schedule {
            index
            lesson {
              _id
              title
              icon
            }
          }
        }
      }`,
    });
  }

  create(clss: Class) {
    return this.apollo.mutate({
      mutation: gql`
      mutation {
        createClass(class: {
            level: "${clss.level}"
            number:  "${clss.number}"
            name: "${clss.name}"
        }) { _id }
      }
    `}).toPromise();
  }

  update(_class: Class) {
    const {name, level, number} = _class;
    const inputClass: InputClass = {name, level, number};
    if (_class.schedule) {
      inputClass.schedule = _class.schedule;
    }
    return this.apollo.mutate({
      mutation: this.updateClass,
      variables: {
        id: _class._id,
        class: inputClass,
      },
    }).toPromise();
  }

  delete(id: string) {
    return this.apollo.mutate({
      mutation: gql`
      mutation {
        deleteClass(
          id: "${id}"
        )
    }
    `}).toPromise();
  }
}
