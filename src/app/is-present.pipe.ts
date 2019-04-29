import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isPresent'
})
export class IsPresentPipe implements PipeTransform {

  transform(values: any[], args?: any): any {
    return values.filter((item) => item.read === false );
  }

}
