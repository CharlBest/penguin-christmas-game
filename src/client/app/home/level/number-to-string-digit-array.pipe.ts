import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberToStringDigitArray'
})
export class NumberToStringDigitArrayPipe implements PipeTransform {
    transform(value: number): Array<string> | null {
        if (value !== null && value !== undefined) {
            return value.toString().split('');
        } else {
            return null;
        }
    }
}
