import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isRead'
})
export class IsReadPipe implements PipeTransform {

  transform(values: any[], args?: any): any {
    return values.filter((item) => item.read = true );
  }

}
