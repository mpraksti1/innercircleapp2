import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import 'rxjs/Rx'
import { Observable } from 'rxjs/Rx';
import {SignIn} from '../models/signIn.model';

@Injectable()

export class CheckinService {

  constructor(private http: Http) { }

  createSignin(signin: SignIn) {
    console.log(signin);
    const body = JSON.stringify(signin);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post('/api/new-signin', body, { headers: headers })
      .map(data => data.json())
      .catch((error: Response) => Observable.throw(error.json));
  }

  getSignIns(bodyObj) {
    // console.log(bodyObj);

    const body = bodyObj;

    const headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post('/api/getsignins', body)
      .map((response: Response) => {
        const signIns = response.json().data;
        const transformedSignIns: SignIn[] = [];

        for (const signIn of signIns) {
          transformedSignIns.push(new SignIn(
            signIn.userId,
            signIn.classId,
            signIn.dateLogged,
            signIn.name)
          );
        }

        // console.log(transformedSignIns);
        return transformedSignIns;
      });
  }
}
