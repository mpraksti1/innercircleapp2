import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import 'rxjs/Rx'
import { Observable } from 'rxjs/Rx';
import { Student } from '../models/student.model';

@Injectable()
export class StudentsService {

  constructor(private http: Http) { }

  createStudent(user: Student) {
    const body = JSON.stringify(user);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post('/api/new-student', body, { headers: headers })
      .map(data => data.json())
      .catch((error: Response) => Observable.throw(error.json));
  }

  getStudents() {
    return this.http.get('/api/students-list')
      .map((response: Response) => {
        const students = response.json().data;
        const transformedStudents: Student[] = [];
        for (let student of students) {
          transformedStudents.push(new Student(
            student.name,
            student.email,
            student._id)
          );
        }
        return transformedStudents;
      });
  }
}
