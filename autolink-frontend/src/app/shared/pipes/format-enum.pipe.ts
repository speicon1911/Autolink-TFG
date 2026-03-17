import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatEnum',
  standalone: true
})
export class FormatEnumPipe implements PipeTransform {
  transform(value: any): string {
    if (!value || typeof value !== 'string') {
      return value;
    }
    return value.replace(/_/g, ' ');
  }
}
