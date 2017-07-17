import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import 'rxjs/Rx'
import { Observable } from 'rxjs/Rx';
import {KarateClass} from "../models/karateClass.model";

@Injectable()

export class ClassesService {

  constructor(private http: Http) { }

  createClass(kclass: KarateClass) {
    const body = JSON.stringify(kclass);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post('/api/new-class', body, { headers: headers })
      .map(data => data.json())
      .catch((error: Response) => Observable.throw(error.json));
  }

  getClasses() {
    return this.http.get('/api/classes-list')
      .map((response: Response) => {
        const kclasses = response.json().data;
        const transformedClasses: KarateClass[] = [];
        for (let kclass of kclasses) {
          transformedClasses.push(new KarateClass(
            kclass.name,
            kclass.description,
            kclass._id)
          );
        }

        return transformedClasses;
      });
  }
}
