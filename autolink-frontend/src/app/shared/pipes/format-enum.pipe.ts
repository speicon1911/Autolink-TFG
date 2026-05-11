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

    const mapping: { [key: string]: string } = {
      'GASOLINA': 'Gasolina',
      'HIBRIDO': 'Híbrido',
      'DIESEL': 'Diésel',
      'ELECTRICO': 'Eléctrico',
      'GLP': 'GLP',
      'GNC': 'GNC',
      'HIDROGENO': 'Hidrógeno'
    };

    if (mapping[value]) {
      return mapping[value];
    }

    // Fallback for other enums: replace underscores and title case
    return value.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
