import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import 'rxjs/Rx'
import { Observable } from 'rxjs/Rx';
import {SignIn} from '../models/signIn.model';

@Injectable()

export class CheckinService {

  constructor(private http: Http) { }
  createSignin(signin: SignIn) {
    const body = JSON.stringify(signin);


    const headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post('/api/new-signin', body, { headers: headers })
      .map(data => data.json())
      .catch((error: Response) => Observable.throw(error.json));
  }

  getSignIns(studentId) {
    return this.http.get('/api/' + studentId + '/signins')

      .map((response: Response) => {


        const signIns = response.json().data;
        const transformedSignIns: SignIn[] = [];

        for (let signIn of signIns) {
          transformedSignIns.push(new SignIn(
            signIn.userId,
            signIn.classId,
            signIn.dateLogged)
          );
        }

        return transformedSignIns;
      });
  }
}
