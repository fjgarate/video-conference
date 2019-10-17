import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isDoc'
})
export class IsDocPipe implements PipeTransform {

  transform(values: any[], args?: any): any {
    return values.filter((item) => item.role === 'clinical' );
  }

}
