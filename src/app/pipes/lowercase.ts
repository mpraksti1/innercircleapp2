import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'lowercase' })

export class LowerCasePipe implements PipeTransform {
  public transform(value: string, filter: string): string {
    if (!value || !value.length) { return ''; }
    if (!filter) { return value; }

    return value.toLowerCase();
  }
}
