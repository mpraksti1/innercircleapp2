import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'studentfilter' })

export class StudentFilterPipe implements PipeTransform {
  public transform(values: any[], filter: string): any[] {
    if (!values || !values.length) { return []; }
    if (!filter) { return values; }

    return values.filter(v => v.name.indexOf(filter) >= 0);
  }
}
